// src/app/oauth/route.ts
import { avatarPlaceholderUrl } from "@/constants";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appWriteConfig } from "@/lib/appwrite/config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const secret = request.nextUrl.searchParams.get("secret");

  if (!userId || !secret) {
    return NextResponse.redirect(`${request.nextUrl.origin}/signup?error=missing_oauth_params`);
  }

  // 1) Exchange the one-time secret for a session
  const { account: adminAccount } = await createAdminClient();
  const session = await adminAccount.createSession(userId, secret);

  // 2) Build a user-scoped client using the freshly issued session.secret
  const { account, databases } = await createSessionClient(session.secret);

  // 3) Ensure a profile doc exists (don’t try to store password for OAuth users)
  const existing = await databases.listDocuments(
    appWriteConfig.databaseID,
    appWriteConfig.userCollectionID,
    [Query.equal("accountId", session.userId)],
  );

  if (existing.total === 0) {
    const me = await account.get();
    await databases.createDocument(
      appWriteConfig.databaseID,
      appWriteConfig.userCollectionID,
      ID.unique(),
      {
        fullName: me.name,
        email: me.email,
        accountId: me.$id,
        password: me.$id,
        avatar: avatarPlaceholderUrl,
      }
    );
  }

  // 4) Set cookie on the response (use Lax for OAuth redirects)
  const res = NextResponse.redirect(`${request.nextUrl.origin}/`);
  (await cookies()).set("appwrite-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    secure: true,
  });
  return res;
}
