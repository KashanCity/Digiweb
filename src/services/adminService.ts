import { databases, appwriteConfig, Query } from '@/lib/appwrite';
import type { AppUser, UserRole } from '@/types';

const { databaseId, collections } = appwriteConfig;

export async function listUsers(searchTerm?: string): Promise<AppUser[]> {
  const queries = searchTerm ? [Query.search('name', searchTerm)] : [];
  const res = await databases.listDocuments(databaseId, collections.users, queries);
  return res.documents.map(mapUserDocument);
}

/**
 * ⚠️ نکته امنیتی حیاتی:
 * تغییر Role کاربر هرگز نباید صرفاً با یک updateDocument ساده از Frontend
 * انجام شود، چون در آن صورت هر کاربری با ابزارهای توسعه‌دهنده مرورگر
 * می‌تواند تلاش کند نقش خودش را تغییر دهد.
 * راه‌حل صحیح: Permission سند «role» در Collection «users» باید فقط
 * برای Team «admins» قابل Update باشد (نه برای خود کاربر)، و این تابع
 * باید یک Appwrite Function امن (با API Key سمت سرور) را صدا بزند که
 * ابتدا بررسی می‌کند درخواست‌دهنده واقعاً ادمین است.
 */
export async function updateUserRole(userId: string, role: UserRole): Promise<void> {
  await databases.updateDocument(databaseId, collections.users, userId, { role });
}

export async function setUserSuspended(userId: string, suspended: boolean): Promise<void> {
  await databases.updateDocument(databaseId, collections.users, userId, { suspended });
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
    createdAt: doc.$createdAt,
    suspended: doc.suspended ?? false,
  };
}
