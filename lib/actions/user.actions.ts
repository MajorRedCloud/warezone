"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createClientSession } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const getUserByEmail = async (email: string) => {
    const {databases} = await createAdminClient()

    const result  = await databases.listDocuments(
        appwriteConfig.database!,
        appwriteConfig.usersCollection!,
        [Query.equal('email', email)]
    )

    return result.total > 0 ? result.documents[0] : null
}

export const sendEmailOTP = async (email:string) => {
    const {account} = await createAdminClient()

    try {
        const result = await account.createEmailToken(
            ID.unique(),
            email
        )

        return result.userId
    } catch (error) {
        console.log(error)
    }
}

export const createAccount = async ({fullName, email} : {fullName: string, email: string}) => {
   const exisitingUser = await getUserByEmail(email)
   
   const accountId = await sendEmailOTP(email)
   
   if(!accountId) {
    throw new Error('Failed to send OTP')
   }

   if(!exisitingUser) {
    const {databases} = await createAdminClient()

    await databases.createDocument(
        appwriteConfig.database!,
        appwriteConfig.usersCollection!,
        ID.unique(),
        {
            fullName, 
            email,
            avatar: 'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?semt=ais_hybrid',
            accountId: accountId
        }
    )
   }

   return parseStringify( {accountId} )
}

export const verifyOTP = async ({accountId, password} : {
    accountId: string,
    password: string
}) => {
    try {
        const { account } = await createAdminClient()

        const session = await account.createSession(accountId, password);
        console.log(session);

        (await cookies()).set('appwrite-session', session.secret, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: true
        })

        return parseStringify({sessionId: session.$id})

    } catch (error) {
        console.error(error)
    }

}

export const getCurrentUser = async () => {
    const {databases, account} = await createClientSession()

    const result  = await account.get()
    const user = await databases.listDocuments(
        appwriteConfig.database!,
        appwriteConfig.usersCollection!,
        [Query.equal('accountId', result.$id)]
    )

    if(user.total < 0){
        return null
    } else {
        return parseStringify(user.documents[0])
    }

}

export const logout = async () => {
    const {account} = await createClientSession()

    try {
        await account.deleteSession('current');
        (await cookies()).delete("appwrite-session")
    } catch (error) {
        console.log(error)
    } finally {
        redirect('/signin')
    }
}

export const signInUser = async ({email} : {
    email:string
}) => {
    try {
        const exisitingUser = await getUserByEmail(email)

        if(exisitingUser){
            await sendEmailOTP(email)
            return parseStringify({accountId: exisitingUser.accountId})
        }

        return parseStringify({accountId: null, error: "User not found"})
    } catch (error) {
        console.error(error)
    }
}