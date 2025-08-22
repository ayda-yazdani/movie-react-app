import { createContext, useContext, useState, useEffect } from "react";
import { SafeAreaView, Text } from "react-native";
import { createAccount, signIn, getCurrentUser, signOut, signInWithGoogle } from "./appwrite";

export interface AuthContextType {
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signout: () => Promise<void>;
  refreshAuthState: () => Promise<void>;
  isLoading: boolean;
  user: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children } : { children: React.ReactNode}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Check for existing session on app startup
    useEffect(() => {
        checkCurrentUser();
    }, []);

    const checkCurrentUser = async () => {
        try {
            console.log("AuthContext: Checking for existing user...");
            setIsLoading(true);
            const currentUser = await getCurrentUser();
            console.log("AuthContext: getCurrentUser result:", { user: !!currentUser, email: currentUser?.email });
            if (currentUser) {
                setUser(currentUser);
                console.log("AuthContext: User found, setting as logged in");
            } else {
                setUser(null);
                console.log("AuthContext: No user found, setting as logged out");
            }
        } catch (error) {
            console.log("AuthContext: Error checking user:", error);
            setUser(null);
        } finally {
            console.log("AuthContext: Setting isLoading to false");
            setIsLoading(false);
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
        user 
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

