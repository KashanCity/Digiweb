import { ID } from 'appwrite';
import { account, databases, appwriteConfig } from '@/lib/appwrite';
import type { AppUser } from '@/types';

export interface RegisterInput {
  name: string;
  username: string;
  email: string;
  password: string;
}

/**
 * ثبت‌نام واقعی با Appwrite Authentication.
 * پس از ساخت حساب، یک سند پروفایل در Collection «users» ساخته می‌شود
 * تا اطلاعات تکمیلی (نام کاربری، نقش و ...) نگهداری شوند.
 */
export async function registerUser(input: RegisterInput): Promise<AppUser> {
  const newAccount = await account.create(ID.unique(), input.email, input.password, input.name);

  await account.createEmailPasswordSession(input.email, input.password);

  const profile = await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.collections.users,
    newAccount.$id,
    {
      name: input.name,
      username: input.username,
      email: input.email,
      role: 'user',
      createdAt: new Date().toISOString(),
    },
  );

  return mapUserDocument(profile);
}

export async function loginUser(email: string, password: string): Promise<void> {
  await account.createEmailPasswordSession(email, password);
}

export async function logoutUser(): Promise<void> {
  await account.deleteSession('current');
}

export async function sendPasswordRecovery(email: string, redirectUrl: string): Promise<void> {
  await account.createRecovery(email, redirectUrl);
}

export async function confirmPasswordRecovery(
  userId: string,
  secret: string,
  newPassword: string,
): Promise<void> {
  await account.updateRecovery(userId, secret, newPassword);
}

export async function getCurrentUser(): Promise<AppUser | null> {
  try {
    const current = await account.get();
    const profile = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.users,
      current.$id,
    );
    return mapUserDocument(profile);
  } catch {
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapUserDocument(doc: any): AppUser {
  return {
    id: doc.$id,
    name: doc.name,
    username: doc.username,
    email: doc.email,
    avatarUrl: doc.avatarUrl,
    role: doc.role ?? 'user',
    createdAt: doc.createdAt ?? doc.$createdAt,
    suspended: doc.suspended ?? false,
  };
}
