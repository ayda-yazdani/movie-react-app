import { Models } from 'react-native-appwrite'

export type User = Models.User<Models.Preferences>

export interface AuthContextType {
    user: User | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string, name: string) => Promise<void>
    logout: () => Promise<void>
}

