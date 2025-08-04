"use server";

import { createAdminClient } from "../appwrite";
import { InputFile } from "node-appwrite/file";
import { appWriteConfig } from "../appwrite/config";
import { ID } from "node-appwrite";
import { constructFileUrl, getFileType, handleError } from "../utils";
import { revalidatePath } from "next/cache";

interface FileUploadProps {
    file: File;
    ownerId: string;
    accountId: string;
    path: string;
}

export const uploadFile = async ({file, ownerId, accountId, path}: FileUploadProps) => {
    const {storage, databases} = await createAdminClient();
    try {
        const inputFile = InputFile.fromBuffer(file, file.name);

        const bucketFile = await storage.createFile(
            appWriteConfig.bucketID,
            ID.unique(),
            inputFile
        )

        const fileDocument = {
            type: getFileType(file.name).type,
            name: file.name,
            url: constructFileUrl(bucketFile.$id),
            extension: getFileType(file.name).extension,
            size: bucketFile.sizeOriginal,
            owner: ownerId,
            accountId,
            users: [],
            bucketFileId: bucketFile.$id,
        }

        console.log("fileDocument", fileDocument);

        const newfile = await databases.createDocument(
            appWriteConfig.databaseID,
            appWriteConfig.filesCollectionID,
            ID.unique(),
            fileDocument
        ).catch(async (error) => {
            await storage.deleteFile(appWriteConfig.bucketID, bucketFile.$id);
            return handleError(error, "Failed to create Document");
        });

        console.log("bucketFile", bucketFile);
        console.log("newfile", newfile);

        revalidatePath(path);
        
        return {
            success: "File uploaded successfully",
            data: {
                newfile,
                bucketFile
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message, message: "Failed to upload file" };
          }
          return { error: error, message: "Failed to upload file" }
    }
}
