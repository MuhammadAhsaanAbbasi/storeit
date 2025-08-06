"use server";

import { createAdminClient } from "../appwrite";
import { InputFile } from "node-appwrite/file";
import { appWriteConfig } from "../appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { constructFileUrl, getFileType, handleError } from "../utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.actions";

interface FileUploadProps {
    file: File;
    ownerId: string;
    accountId: string;
    path: string;
}

export const uploadFile = async ({ file, ownerId, accountId, path }: FileUploadProps) => {
    const { storage, databases } = await createAdminClient();
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
            return {
                error: handleError(error, "Failed to create Document"),
                message: "Failed to create Document"
            }
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

const createQueries = (currentUser: Models.Document, types: string[]) => {
    // match if I’m the owner…
    const ownerQ = Query.equal("owner", currentUser.$id);
    // …or if my email is in the users array
    const sharedQ = Query.contains("users", currentUser.email);

    const queries = [Query.or([ownerQ, sharedQ])];

    if (types.length > 0) queries.push(Query.equal("type", types));

    return queries;
};


export const getFiles = async ({ types }: { types: string[] }) => {
    const { databases } = await createAdminClient();
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return {
                error: "User not found"
            }
        }

        const queries = createQueries(currentUser, types);

        // console.log("queries", queries);

        const files = await databases.listDocuments(
            appWriteConfig.databaseID,
            appWriteConfig.filesCollectionID,
            queries
        );

        // console.log("files", files);

        return {
            data: files
        }
    } catch (err) {
        return {
            error: handleError(err, "Failed to get files")
        }
    }
}


export const renameFile = async ({ fileId, name, path }: RenameFileProps) => {
    const { databases } = await createAdminClient();
    try {
        const file = await databases.updateDocument(
            appWriteConfig.databaseID,
            appWriteConfig.filesCollectionID,
            fileId,
            {
                name,
            }
        );
        revalidatePath(path);
        return {
            success: "File renamed successfully",
            data: file
        }
    } catch (err) {
        return {
            error: handleError(err, "Failed to rename file")
        }
    }
}


export const updateFileUsers = async ({ fileId, emails, path }: UpdateFileUsersProps) => {
    const { databases } = await createAdminClient();
    try {

        // 3) update
        const file = await databases.updateDocument(
            appWriteConfig.databaseID,
            appWriteConfig.filesCollectionID,
            fileId,
            { users: emails }
        );
        revalidatePath(path);
        return {
            success: "File users updated successfully",
            data: file
        }
    } catch (err) {
        return {
            error: handleError(err, "Failed to update file users")
        }
    }
}

export const deleteFile = async ({ fileId, bucketFileId, path }: DeleteFileProps) => {
    const { databases, storage } = await createAdminClient();
    try {
        const deletedFile = await databases.deleteDocument(
            appWriteConfig.databaseID,
            appWriteConfig.filesCollectionID,
            fileId
        );

        if (deletedFile) {
            await storage.deleteFile(appWriteConfig.bucketID, bucketFileId);
        }
        revalidatePath(path);
        return {
            success: "File deleted successfully",
        }
    } catch (err) {
        return {
            error: handleError(err, "Failed to delete file")
        }
    }
}