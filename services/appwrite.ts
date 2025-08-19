// track the searches made by a user

import { Account, Client, Databases, ID, Query } from "react-native-appwrite"
import { Platform } from "react-native"

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
        console.log("appwrite.ts: account.get() success:", { user: !!currentUser, email: currentUser?.email });
        return currentUser
    } catch (error) {
        console.log("appwrite.ts: account.get() error:", error);
        return null
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