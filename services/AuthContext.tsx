import { createContext, useContext, useEffect, useState } from "react";
import { checkAndRefreshOAuthTokens, createAccount, getCurrentSession, getCurrentUser, getGoogleProfile, getUserIdentities, signIn, signInWithGoogle, signOut } from "./appwrite";

export interface AuthContextType {
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signout: () => Promise<void>;
  refreshAuthState: () => Promise<void>;
  isLoading: boolean;
  user: any;
  userProfile: {
    name: string;
    email: string;
    avatar?: string;
  } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children } : { children: React.ReactNode}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [userProfile, setUserProfile] = useState<{name: string; email: string; avatar?: string} | null>(null);

    // Check for existing session on app startup
    useEffect(() => {
        checkCurrentUser();
    }, []);

    const checkCurrentUser = async () => {
        try {
            console.log("AuthContext: Checking for existing user...");
            setIsLoading(true);
            
            // First check and refresh OAuth tokens if needed
            const tokenWasRefreshed = await checkAndRefreshOAuthTokens();
            if (tokenWasRefreshed) {
                console.log("AuthContext: OAuth tokens were refreshed");
            }
            
            const currentUser = await getCurrentUser();
            console.log("AuthContext: getCurrentUser result:", { user: !!currentUser, email: currentUser?.email });
            
            if (currentUser) {
                setUser(currentUser);
                console.log("AuthContext: User found, fetching profile info...");
                
                // Fetch enhanced profile info (will get fresh tokens if they were refreshed)
                await fetchUserProfile(currentUser);
                
                console.log("AuthContext: User found, setting as logged in");
            } else {
                setUser(null);
                setUserProfile(null);
                console.log("AuthContext: No user found, setting as logged out");
            }
        } catch (error) {
            console.log("AuthContext: Error checking user:", error);
            setUser(null);
            setUserProfile(null);
        } finally {
            console.log("AuthContext: Setting isLoading to false");
            setIsLoading(false);
        }
    };

    const fetchUserProfile = async (currentUser: any) => {
        try {
            // Start with basic user info from Appwrite
            const profile = {
                name: currentUser.name || 'User',
                email: currentUser.email || '',
                avatar: undefined as string | undefined
            };

            // Try to get session info to check for OAuth provider
            const session = await getCurrentSession();
            
            if (session && session.providerAccessToken && 
                (session.provider === 'google' || session.provider?.toLowerCase().includes('google'))) {
                console.log("AuthContext: Fetching Google profile info...");
                const googleProfile = await getGoogleProfile(session.providerAccessToken);
                
                if (googleProfile) {
                    profile.name = googleProfile.name || profile.name;
                    profile.avatar = googleProfile.picture;
                    console.log("AuthContext: Google profile fetched successfully");
                }
            } else if (session && session.provider === 'oauth2') {
                console.log("AuthContext: OAuth session detected, checking user identities...");
                // Try to get profile info from identities since session access token isn't available
                const identities = await getUserIdentities();
                
                // Look for Google identity that might have profile info
                if (identities && identities.identities) {
                    const googleIdentity = identities.identities.find((identity: any) => 
                        identity.provider?.toLowerCase().includes('google')
                    );
                    
                    if (googleIdentity) {
                        console.log("AuthContext: Found Google identity:", {
                            provider: googleIdentity.provider,
                            hasAccessToken: !!googleIdentity.providerAccessToken,
                            tokenExpiry: googleIdentity.providerAccessTokenExpiry
                        });
                        
                        // Use the access token from identity to fetch Google profile
                        if (googleIdentity.providerAccessToken) {
                            console.log("AuthContext: Using Google identity access token to fetch profile...");
                            const googleProfile = await getGoogleProfile(googleIdentity.providerAccessToken);
                            
                            if (googleProfile) {
                                profile.name = googleProfile.name || profile.name;
                                profile.avatar = googleProfile.picture;
                                console.log("AuthContext: Google profile fetched successfully from identity token:", {
                                    hasName: !!googleProfile.name,
                                    hasAvatar: !!googleProfile.picture
                                });
                            }
                        }
                    }
                }
            } else {
                console.log("AuthContext: No OAuth session found, using basic profile only");
            }

            console.log("AuthContext: Setting user profile:", {
                hasName: !!profile.name,
                hasEmail: !!profile.email,
                hasAvatar: !!profile.avatar
            });
            
            setUserProfile(profile);
        } catch (error) {
            console.log("AuthContext: Error fetching user profile:", error);
            // Fallback to basic profile
            setUserProfile({
                name: currentUser.name || 'User',
                email: currentUser.email || '',
                avatar: undefined
            });
        }
    };

    // Expose checkCurrentUser for manual refresh
    const refreshAuthState = checkCurrentUser;

    const signin = async (email: string, password: string) => {
        try {
            console.log("AuthContext: Attempting signin...");
            const session = await signIn(email, password);
            console.log("AuthContext: signIn successful, session created:", !!session);
            
            // Refresh the auth state to detect the new session
            console.log("AuthContext: Refreshing auth state after successful signin");
            await checkCurrentUser();
            
            console.log("AuthContext: Signin complete, auth state refreshed");
        } catch (error) {
            console.log("AuthContext: Sign in error:", error);
            setUser(null);
            throw error;
        }
    };

    const signup = async (email: string, password: string, name: string) => {
        try {
            console.log("AuthContext: Attempting signup...");
            await createAccount(email, password, name);
            console.log("AuthContext: Account created, signing in...");
            await signIn(email, password);
            console.log("AuthContext: Signed in after signup, refreshing auth state");
            await checkCurrentUser();
            console.log("AuthContext: Signup complete, auth state refreshed");
        } catch (error) {
            console.log("AuthContext: Sign up error:", error);
            setUser(null);
            throw error;
        }
    };

    const googleSignIn = async () => {
        try {
            console.log("AuthContext: Attempting Google sign in...");
            const result = await signInWithGoogle();
            console.log("AuthContext: Google OAuth result:", result);
            
            // The signInWithGoogle function now handles session checking internally
            // If we get here without an error, the user should be logged in
            console.log("AuthContext: OAuth completed, refreshing auth state");
            await checkCurrentUser();
            console.log("AuthContext: Auth state refreshed after Google OAuth");
        } catch (error) {
            console.log("AuthContext: Google sign in error:", error);
            setUser(null);
            throw error;
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            console.log("AuthContext: Attempting signout...");
            await signOut();
            console.log("AuthContext: Signout successful");
            setUser(null);
        } catch (error) {
            console.log("AuthContext: Sign out error:", error);
            // Even if signout fails, clear the local user state
            setUser(null);
            // Don't throw error, as we still want to clear local state
        } finally {
            setIsLoading(false);
        }
    };

    const contextData = { 
        signin, 
        signup, 
        signInWithGoogle: googleSignIn,
        signout: logout,
        refreshAuthState,
        isLoading, 
        user,
        userProfile 
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthContext, AuthProvider, useAuth };

