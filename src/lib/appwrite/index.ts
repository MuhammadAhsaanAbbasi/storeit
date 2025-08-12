"use server";

import { Client, Account, Databases, Storage, Avatars } from "node-appwrite";
import { appWriteConfig } from "./config";
import { cookies } from "next/headers";


export const createSessionClient = async (sessionSecret?: string) => {
    const client = new Client()
        .setEndpoint(appWriteConfig.endpoint)
        .setProject(appWriteConfig.projectID)

    const cookieVal = (await cookies()).get("appwrite-session")?.value;
    const token = sessionSecret ?? cookieVal;

    if (!token) throw new Error("Unauthorized");

    client.setSession(token);

    return {
        get account() {
            return new Account(client)
        },
        get databases() {
            return new Databases(client)
        },
    };
};

export const createAdminClient = async () => {
    const client = new Client()
        .setEndpoint(appWriteConfig.endpoint)
        .setProject(appWriteConfig.projectID)
        .setKey(appWriteConfig.secretKey);

    return {
        get account() {
            return new Account(client)
        },
        get databases() {
            return new Databases(client)
        },
        get storage() {
            return new Storage(client)
        },
        get avatars() {
            return new Avatars(client)
        }
    };
};