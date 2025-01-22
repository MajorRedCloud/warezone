'use server'

import { createAdminClient } from "../appwrite"
import { InputFile } from 'node-appwrite/file'
import { appwriteConfig } from "../appwrite/config"
import { ID, Models, Query } from "node-appwrite"
import { constructFileUrl, getFileType, parseStringify } from "../utils"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./user.actions"


declare type UploadFileProps = {
    file: File,
    ownerId: string,
    accountId: string,
    path: string
}

const createNewQueries = (currentUser : Models.Document, types: string[], searchText:string, sort:string, limit?:number) => {
    const queries = [
        Query.or([
            Query.equal('owner', currentUser.$id),
            Query.contains('users', currentUser.email)
        ])
    ]

    if(types.length > 0) {
        queries.push(Query.equal('type', types))
    }

    if(searchText) {
        queries.push(Query.contains('name', searchText))
    }

    if(limit) {
        queries.push(Query.limit(limit))
    }

    const [sortBy, orderBy] = sort.split('-')

    queries.push(orderBy === 'asc' ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy))

    return queries
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

export const getFiles = async ({types = [], searchText = '', sort = '$createdAt-desc', limit} : GetFilesProps) => {
    try {
        const {databases} = await createAdminClient()
        const currentUser = await getCurrentUser() 
    
        if(!currentUser) throw new Error('User not found')  
    
        const queries = createNewQueries(currentUser, types, searchText, sort, limit)
    
        const response = await databases.listDocuments(
            appwriteConfig.database!,
            appwriteConfig.filesCollection!,
            queries!
        )
    
        return parseStringify(response.documents)

    } catch (error) {
        console.error(error)
    }
}

export const renameFile = async ({fileId, name, extension, path} : RenameFileProps) => {
    const {databases} = await createAdminClient()

    try {
        const newName = `${name}.${extension}`
        const updatedFile = await databases.updateDocument(
            appwriteConfig.database!,
            appwriteConfig.filesCollection!,
            fileId,
            {
                name: newName
            }
        )

        revalidatePath(path)
        return parseStringify(updatedFile)  
    } catch (error) {
        console.error(error)
    }
}

export const shareFileWithUsers = async ({fileId, emails, path} : UpdateFileUsersProps) => {
    const {databases} = await createAdminClient()

    try {
        const file = await databases.getDocument(
            appwriteConfig.database!,
            appwriteConfig.filesCollection!,
            fileId
        )

        const updatedUsers = [...file.users, ...emails]

        const updatedFile = await databases.updateDocument(
            appwriteConfig.database!,
            appwriteConfig.filesCollection!,
            fileId,
            {
            users: updatedUsers
            }
        )

        revalidatePath(path)
        return parseStringify(updatedFile)  
    } catch (error) {
        console.error(error)
    }
}

export const removeFileWithUsers = async ({fileId, email, path} : removeFileWithUsersProps) => {
    const {databases} = await createAdminClient()

    try {
        const file = await databases.getDocument(
            appwriteConfig.database!,
            appwriteConfig.filesCollection!,
            fileId
        )

        let updatedUsers = [...file.users]
        updatedUsers = updatedUsers.filter((e) => e != email)
        console.log('updated users', updatedUsers)

        const updatedFile = await databases.updateDocument(
            appwriteConfig.database!,
            appwriteConfig.filesCollection!,
            fileId,
            {
            users: updatedUsers
            }
        )

        revalidatePath(path)
        return parseStringify(updatedFile)  
    } catch (error) {
        console.error(error)
    }
}

export const deleteFile = async ({fileId,bucketFileId, path} : {fileId: string, path: string, bucketFileId:string}) => {
    try {
        const {databases, storage} = await createAdminClient()

        const result = await databases.deleteDocument(
            appwriteConfig.database!,
            appwriteConfig.filesCollection!,
            fileId
        )

        if (result) {
            await storage.deleteFile(appwriteConfig.buckedId!, bucketFileId)
        }

        revalidatePath(path)
        return parseStringify(result) 
    } catch (error) {
        console.error(error)
    }
}

export async function getTotalSpaceUsed() {
    try {
      const { databases } = await createAdminClient();
      const currentUser = await getCurrentUser();
      if (!currentUser) throw new Error("User is not authenticated.");
  
      const files = await databases.listDocuments(
        appwriteConfig.database!,
        appwriteConfig.filesCollection!,
        [Query.equal("owner", [currentUser.$id])],
      );
  
      const totalSpace = {
        image: { size: 0, latestDate: "" },
        document: { size: 0, latestDate: "" },
        video: { size: 0, latestDate: "" },
        audio: { size: 0, latestDate: "" },
        other: { size: 0, latestDate: "" },
        used: 0,
        all: 2 * 1024 * 1024 * 1024 /* 2GB available bucket storage */,
      };
  
      files.documents.forEach((file) => {
        const fileType = file.type as FileType;
        totalSpace[fileType].size += file.size;
        totalSpace.used += file.size;
  
        if (
          !totalSpace[fileType].latestDate ||
          new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)
        ) {
          totalSpace[fileType].latestDate = file.$updatedAt;
        }
      });
  
      return parseStringify(totalSpace);
    } catch (error) {
      console.error("Error calculating total space used:, ", error);
    }
  }
