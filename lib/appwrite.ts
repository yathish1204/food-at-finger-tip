import { CreateUserParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite";

export const appwriteConfig = {
    endpoint:process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    projectId:process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    platform:"com.nshettigar.foodordering",
    databaseId:"686905530007a80dd6ad",
    userCollectionId:"6869057900064adf2f94",
}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const databases = new Databases(client);
const avatars = new Avatars(client);

export const createUser = async({email,password,name}:CreateUserParams)=>{
    try {
        const newAccount = await account.create(ID.unique(),email,password,name);
        if(!newAccount) throw Error;

        await signIn({email,password});
        const avatarUrl = avatars.getInitialsURL(name);
        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                email,name,
                accountId: newAccount.$id,
                avatar:avatarUrl
            }
        )
    } catch (error) {
        throw new Error (error as string)
    }
}

export const signIn = async ({email,password}:SignInParams
)=>{
    try {
        const session= await account.createEmailPasswordSession(email,password);
    } catch (error) {
        throw new error (error as string)
    }
}

export const getCurrentUser = async()=>{
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId',currentAccount.$id)]
        )
        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        throw new Error(error as string)
    }
}