// track the searches made by a user

import { Account, Client, Databases, ID, Query, OAuthProvider } from "react-native-appwrite"
import { Platform, Linking } from "react-native"
import * as WebBrowser from 'expo-web-browser'
import { makeRedirectUri } from 'expo-auth-session'

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!

const client = new Client()
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)

switch(Platform.OS){
    case 'ios':
        client.setPlatform(process.env.EXPO_PUBLIC_APPWRITE_BUNDLE_ID!)
        break
    case 'android':
        client.setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PACKAGE_NAME!)
        break
}

const database = new Databases(client)
const account = new Account(client)

export const createAccount = async (email: string, password: string, name: string) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name)
        return newAccount
    } catch (error) {
        console.log(error)
        throw(error)
    }
}

export const signIn = async (email: string, password: string) => {
    try {
        const session = await account.createEmailPasswordSession(email, password)
        return session
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const getCurrentUser = async() => {
    try {
        console.log("appwrite.ts: Calling account.get()");
        const currentUser = await account.get()
        console.log("appwrite.ts: account.get() success:", { 
            user: !!currentUser, 
            email: currentUser?.email,
            name: currentUser?.name,
            prefs: currentUser?.prefs 
        });
        return currentUser
    } catch (error) {
        console.log("appwrite.ts: account.get() error:", error);
        return null
    }
}

export const getCurrentSession = async() => {
    try {
        console.log("appwrite.ts: Getting current session...");
        const session = await account.getSession('current');
        console.log("appwrite.ts: Full session object:", JSON.stringify(session, null, 2));
        console.log("appwrite.ts: Session info:", {
            provider: session?.provider,
            providerUid: session?.providerUid,
            hasAccessToken: !!session?.providerAccessToken,
            accessToken: session?.providerAccessToken ? "***PRESENT***" : "NOT_PRESENT",
            allKeys: Object.keys(session || {})
        });
        return session;
    } catch (error) {
        console.log("appwrite.ts: Error getting session:", error);
        return null;
    }
}

export const getGoogleProfile = async (accessToken: string) => {
    try {
        console.log("appwrite.ts: Fetching Google profile...");
        const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
        const profile = await response.json();
        console.log("appwrite.ts: Google profile:", {
            hasName: !!profile?.name,
            hasAvatar: !!profile?.picture,
            email: profile?.email
        });
        return profile;
    } catch (error) {
        console.log("appwrite.ts: Error fetching Google profile:", error);
        return null;
    }
}

export const getUserIdentities = async () => {
    try {
        console.log("appwrite.ts: Fetching user identities...");
        const identities = await account.listIdentities();
        console.log("appwrite.ts: User identities:", JSON.stringify(identities, null, 2));
        return identities;
    } catch (error) {
        console.log("appwrite.ts: Error fetching identities:", error);
        return null;
    }
}

export const isTokenExpired = (expiryDateString: string): boolean => {
    if (!expiryDateString) return true;
    
    const expiryDate = new Date(expiryDateString);
    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes buffer
    
    return expiryDate <= fiveMinutesFromNow;
}

export const refreshOAuthSession = async (sessionId: string = 'current') => {
    try {
        console.log("appwrite.ts: Refreshing OAuth session...");
        const updatedSession = await account.updateSession(sessionId);
        console.log("appwrite.ts: OAuth session refreshed successfully");
        return updatedSession;
    } catch (error) {
        console.log("appwrite.ts: Error refreshing OAuth session:", error);
        throw error;
    }
}

export const checkAndRefreshOAuthTokens = async () => {
    try {
        console.log("appwrite.ts: Checking OAuth token expiry...");
        const identities = await getUserIdentities();
        
        if (identities && identities.identities) {
            const googleIdentity = identities.identities.find((identity: any) => 
                identity.provider?.toLowerCase().includes('google')
            );
            
            if (googleIdentity && googleIdentity.providerAccessTokenExpiry) {
                const isExpired = isTokenExpired(googleIdentity.providerAccessTokenExpiry);
                console.log("appwrite.ts: Token status:", {
                    expiry: googleIdentity.providerAccessTokenExpiry,
                    isExpired,
                    timeUntilExpiry: new Date(googleIdentity.providerAccessTokenExpiry).getTime() - Date.now()
                });
                
                if (isExpired) {
                    console.log("appwrite.ts: Token expired or expiring soon, refreshing...");
                    await refreshOAuthSession();
                    console.log("appwrite.ts: Token refresh completed");
                    return true; // Token was refreshed
                }
            }
        }
        
        return false; // No refresh needed
    } catch (error) {
        console.log("appwrite.ts: Error checking/refreshing OAuth tokens:", error);
        return false;
    }
}

export const signOut = async() => {
    try {
        await account.deleteSession('current')
        return true
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const updateSearchCount = async (query: string, movie: Movie) => {

    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', query)
        ])

        if (result.documents.length > 0)
        {
            const existingMovie = result.documents[0]

            await database.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                existingMovie.$id,
                {
                    count: existingMovie.count + 1
                }
            )
        } else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
            searchTerm: query,
            movie_id: movie.id,
            count: 1,
            title: movie.title,
            poster_url: `https://inage.tmdb.org/t/p/w500${movie.poster_path}`
            })
        }
    } catch (error) {
        console.log(error)
        throw error
    }
    
    // check if a record of that search has already been stored
    // if a document is found increment the searchCount field
    // if no document is found create a
        // new document in Appwrite database and initialise its count to 1
}

export const getTrendingMovies = async(): Promise<TrendingMovie[] | undefined> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc('count')
        ])

        return result.documents as unknown as TrendingMovie[]
    } catch(error) {
        console.log(error)
        return undefined
    }
}

export const signInWithGoogle = async () => {
    try {
        console.log("appwrite.ts: Initiating Google OAuth following Appwrite documentation...");
        
        // Create deep link that works across Expo environments (Appwrite official pattern)
        const deepLink = new URL(makeRedirectUri({ preferLocalhost: true }));
        const scheme = `${deepLink.protocol}//`; // e.g. 'exp://' or 'appwrite-callback-<PROJECT_ID>://'
        
        console.log("appwrite.ts: Deep link:", deepLink.toString());
        console.log("appwrite.ts: Scheme:", scheme);
        
        // Start OAuth flow (Appwrite official pattern)
        const loginUrl = await account.createOAuth2Token(
            OAuthProvider.Google,
            `${deepLink}`, // success URL
            `${deepLink}`  // failure URL
        );
        
        console.log("appwrite.ts: Opening login URL:", loginUrl.toString());
        
        // Open login URL in browser (Appwrite official pattern)
        const result = await WebBrowser.openAuthSessionAsync(
            `${loginUrl}`, 
            scheme,
            {
                showTitle: false,
                toolbarColor: '#1a1a1a',
                controlsColor: '#ffffff',
            }
        );
        
        console.log("appwrite.ts: WebBrowser result:", result);
        
        if (result.type === 'cancel') {
            throw new Error('OAuth cancelled by user');
        }
        
        if (result.type === 'success' && result.url) {
            console.log("appwrite.ts: Processing OAuth success URL:", result.url);
            
            // Extract credentials from OAuth redirect URL (Appwrite official pattern)
            const url = new URL(result.url);
            const secret = url.searchParams.get('secret');
            const userId = url.searchParams.get('userId');
            
            console.log("appwrite.ts: OAuth parameters:", { userId: !!userId, secret: !!secret });
            
            if (userId && secret) {
                // Create session with OAuth credentials (Appwrite official pattern)
                console.log("appwrite.ts: Creating session with OAuth credentials...");
                const session = await account.createSession(userId, secret);
                console.log("appwrite.ts: Session created successfully:", !!session);
                
                // Get the current user to confirm authentication
                const currentUser = await getCurrentUser();
                if (currentUser) {
                    console.log("appwrite.ts: OAuth successful, user session found");
                    return { type: 'success', user: currentUser };
                } else {
                    throw new Error('Session created but user not found');
                }
            } else {
                throw new Error('OAuth parameters not found in redirect URL');
            }
        } else {
            throw new Error('OAuth flow did not complete successfully');
        }
        
    } catch (error) {
        console.log("appwrite.ts: Google OAuth error:", error);
        throw error;
    }
}