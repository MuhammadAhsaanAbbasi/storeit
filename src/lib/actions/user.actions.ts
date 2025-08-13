"use server";
import { BASE_URL, appWriteConfig } from "@/lib/appwrite/config";
import { LoginSchema, RegisterSchema } from "@/schema/auth";
import { z } from "zod";
import { createAdminClient, createSessionClient } from "../appwrite";
import { Query, ID } from "node-appwrite";
import { handleError, parseStringify } from "../utils";
import { avatarPlaceholderUrl } from "@/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { OAuthProvider } from "node-appwrite";

export async function getOrigin(): Promise<string> {
  const env = process.env.NEXT_PUBLIC_BASE_URL!;
  if (env) return env.replace(/\/$/, ""); // remove trailing slash
  // fallback to header (useful in dev)
  const originHeader = (await headers()).get("x-forwarded-proto")
    ? `${(await headers()).get("x-forwarded-proto")}://${(await headers()).get("host")}`
    : (await headers()).get("origin");
  if (originHeader) return originHeader.replace(/\/$/, "");
  // last resort: throw so you don't send bad redirect to Appwrite
  throw new Error("Unable to determine origin; set NEXT_PUBLIC_BASE_URL in production.");
}

const getUserByEmail = async (email: string) => {
    const { databases } = await createAdminClient();

    const result = await databases.listDocuments(
        appWriteConfig.databaseID,
        appWriteConfig.userCollectionID,
        [Query.equal("email", email)],
    );

    return result.total > 0 ? result.documents[0] : null;
};

export const sendEmailOTP = async (accountId: string, email: string) => {
    const { account } = await createAdminClient();
    
    try {
        const session = await account.createEmailToken(accountId, email);
        return session.userId;
    } catch (error) {
        handleError(error, "Failed to send email OTP")
    }
};


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
        };

        const { account } = await createAdminClient();

        const user = await account.create(ID.unique(), email, password, username);
    
        const accountId = await sendEmailOTP(user.$id, email);
    
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

};


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


export const getCurrentUser = async () => {
    try {
      const { databases, account } = await createSessionClient();
  
      const result = await account.get();
  
      const user = await databases.listDocuments(
        appWriteConfig.databaseID,
        appWriteConfig.userCollectionID,
        [Query.equal("accountId", result.$id)],
      );
  
      if (user.total <= 0) return null;

    //   console.log(user.documents[0].$id);
  
      return {
        data: user.documents[0]
      };
    } catch (err) {
      return {
        error: handleError(err, "Unable to load user Profile")
      }
    }
  };


export const signOut = async () => {
    const { account } = await createSessionClient();
    try {
        await account.deleteSession("current");
        (await cookies()).delete("appwrite-session");
        
        return {
            success: "User signed out successfully"
        }
    } catch (error) {
        handleError(error, "Failed to sign out user");
    }
}

export const signInUser = async (values: z.infer<typeof LoginSchema>) => {
    const isValidate = LoginSchema.safeParse(values)

    if (!isValidate.success) {
        return {
            error: isValidate.error.flatten().fieldErrors
        }
    }

    const { email, password } = isValidate.data;
    const { account } = await createAdminClient();
    
    try {
        const existing_user = await getUserByEmail(email);
        
        if (!existing_user) {
            return {
                error: "User not found"
            }
        }
        
        const session = await account.createEmailPasswordSession(email, password);
        
        (await cookies()).set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            secure: true
        });

        return {
            success: "User signed in successfully",
            data: session.$id
        }
    } catch (err) {
        const { error, message } = handleError(err, "Failed to sign in user");
        return {
            error: error,
            message: message
        }
    }
}


export async function signInWithGithub() {
	const { account } = await createAdminClient();

    const origin = await getOrigin();

	const redirectUrl = await account.createOAuth2Token(
		OAuthProvider.Github,
		`${origin}/oauth/github`,
		`${origin}/signup`,
	);

	return redirect(redirectUrl);
};

export async function signInWithGoogle() {
	const { account } = await createAdminClient();

    const origin = await getOrigin();

	const redirectUrl = await account.createOAuth2Token(
		OAuthProvider.Google,
		`${origin}/oauth/google`,
		`${origin}/signup`,
	);

	return redirect(redirectUrl);
};
