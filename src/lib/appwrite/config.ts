export const appWriteConfig = {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
    projectID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    userCollectionID: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!,
    filesCollectionID: process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION!,
    bucketID: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
    secretKey: process.env.NEXT_APPWRITE_SECRET_KEY!,
};

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;