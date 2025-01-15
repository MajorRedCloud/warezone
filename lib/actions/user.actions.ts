"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";

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
            avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2TgOv9CMmsUzYKCcLGWPvqcpUk6HXp2mnww&s',
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

        (await cookies()).set('appwrite-session', session.$id, {
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