"use server";
import { appWriteConfig } from "@/lib/appwrite/config";
import { RegisterSchema } from "@/schema/auth";
import { z } from "zod";
import { createAdminClient } from "../appwrite";
import { Query, ID } from "node-appwrite";
import { handleError } from "../utils";
import { avatarPlaceholderUrl } from "@/constants";
import { cookies } from "next/headers";

const getUserByEmail = async (email: string) => {
    const { databases } = await createAdminClient();

    const result = await databases.listDocuments(
        appWriteConfig.databaseID,
        appWriteConfig.userCollectionID,
        [Query.equal("email", email)],
    );

    return result.total > 0 ? result.documents[0] : null;
};

export const sendEmailOTP = async (email: string) => {
    const { account } = await createAdminClient();
    
    try {
        const session = await account.createEmailToken(ID.unique(), email);
        return session.userId;
    } catch (error) {
        handleError(error, "Failed to send email OTP")
    }
}


export const registerUser = async (values: z.infer<typeof RegisterSchema>) => {
    const isValidate = RegisterSchema.safeParse(values)

    if (!isValidate.success) {
        return {
            error: isValidate.error.flatten().fieldErrors
        }
    }

    const { username, email, password } = isValidate.data;

    try {
        const existing_user = await getUserByEmail(email);
    
        if (existing_user) {
            return {
                error: "User already exists"
            }
        }
    
        const accountId = await sendEmailOTP(email);
    
        if (!accountId) {
            return {
                error: "Failed to send email OTP"
            }
        }
    
        const { databases } = await createAdminClient();
        await databases.createDocument(
            appWriteConfig.databaseID,
            appWriteConfig.userCollectionID,
            ID.unique(),
            {
                fullName: username,
                email: email,
                password: password,
                accountId,
                avatar: avatarPlaceholderUrl
            }
        )
        console.log(accountId);
        return {
            success: "User registered successfully",
            data: {
                accountId
            }
        }
        
    } catch (error) {
        handleError(error, "Failed to register user")
    }

}

export const verifyEmailOTP = async (accountId: string, password: string) => {
    const { account } = await createAdminClient();
    
    try {
        const session = await account.createSession(accountId, password);
        
        (await cookies()).set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            secure: true
        });
        return {
            success: "OTP verified successfully",
            data: session.$id
        }
    } catch (error) {
        handleError(error, "Failed to verify email OTP")
    }
}
