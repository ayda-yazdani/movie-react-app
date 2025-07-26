import React, { createContext, useContext, useEffect, useState } from 'react';
import { Models } from "react-native-appwrite";
import { createAccount, getCurrentUser, signIn, signOut } from './appwrite';

export type User = Models.User<Models.Preferences>

interface AuthContextType {
    user: User | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string, name: string) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be within AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Check authentication state on app start
    useEffect(() => {
        checkAuthState()
    }, [])

    const checkAuthState = async () => {
        try {
            const currentUser = await getCurrentUser()
            setUser(currentUser)
        } catch (error) {
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }

    const login = async (email: string, password: string) => {
        await signIn(email, password)
        const currentUser = await getCurrentUser()
        setUser(currentUser)
    }

    const register = async (email: string, password: string, name: string) => {
        await createAccount(email, password, name)
        await login(email, password)
    }

    const logout = async () => {
        await signOut()
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}> 
            {children}
        </AuthContext.Provider>
    )


}