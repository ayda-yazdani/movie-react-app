import { createContext, useContext, useState } from "react";
import { SafeAreaView, Text } from "react-native";
import { account } from "../lib/appWriteConfig.js";

// 1. Define the 'shape' or type of your context's data
export interface AuthContextType {
  signin: (email: string, password: string) => Promise<void>;
  // Add other values you'll provide, e.g., user, loading, etc.
  loading: boolean;
  user: any; // Replace 'any' with a proper user type if you have one
}

// 2. Create the context with the type and a default value of undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children } : { children: React.ReactNode}) => {
    const [loading, setLoading] = useState(false);
    const [session, setSession] = useState(false);
    const [user, setUser] = useState(false);

    const signin = async ( {email, password} : {email: string, password: string} ) => {
        setLoading(true)
        try {
            const responseSession = await account.createEmailPasswordSession(
                email,
                password
            )
        } catch (error) {
            console.log(error)
        }
    };
    const signout = async () => {};

    const contextData = { session, user, signin, signout };
    return (
        <AuthContext.Provider value={contextData}>
            {loading ? (
                <SafeAreaView>
                    <Text>Loading..</Text>
                </SafeAreaView>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    return useContext(AuthContext);
};

export { AuthContext, AuthProvider, useAuth };

