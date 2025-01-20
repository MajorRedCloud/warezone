'use server'

import { createAdminClient } from "../appwrite"
import { InputFile } from 'node-appwrite/file'
import { appwriteConfig } from "../appwrite/config"
import { ID } from "node-appwrite"
import { constructFileUrl, getFileType, parseStringify } from "../utils"
import { revalidatePath } from "next/cache"

declare type UploadFileProps = {
    file: File,
    ownerId: string,
    accountId: string,
    path: string
}

export const uploadFile = async ({file, ownerId, accountId, path} : UploadFileProps) => {
    const {storage, databases} = await createAdminClient()
    console.log('account id', accountId)    

    try {
        const inputFile = InputFile.fromBuffer(file, file.name)
        const bucketFile = await storage.createFile(
            appwriteConfig.buckedId!,
            ID.unique(),
            inputFile,
        )

        const fileDocument = {
            type: getFileType(bucketFile.name).type,
            name: bucketFile.name,
            url: constructFileUrl(bucketFile.$id),
            extension: getFileType(bucketFile.name).extension,
            size: bucketFile.sizeOriginal,
            owner: ownerId, 
            accountId: accountId,
            users: [],
            bucketField: bucketFile.$id,
        }

        const response = await databases.createDocument(
            appwriteConfig.database!,
            appwriteConfig.filesCollection!,
            ID.unique(),
            fileDocument
        ) 
            .catch(async (error: unknown) => {
                await storage.deleteFile(appwriteConfig.buckedId!, bucketFile.$id)
                console.error(error)
            })

        console.log(response)
            
        revalidatePath(path)
        return parseStringify(response)

    } catch (error) {
        console.log('failed at uploading',error)
    }
}