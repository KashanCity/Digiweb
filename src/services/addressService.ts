import { databases, appwriteConfig, ID, Query, Permission, Role } from '@/lib/appwrite';
import type { Address } from '@/types';

export async function getAddresses(userId: string): Promise<Address[]> {
  const res = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.collections.addresses, [
    Query.equal('userId', userId),
  ]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return res.documents.map((doc: any) => ({
    id: doc.$id,
    fullName: doc.fullName,
    province: doc.province,
    city: doc.city,
    addressLine: doc.addressLine,
    postalCode: doc.postalCode,
    phone: doc.phone,
  }));
}

/** آدرس‌ها اطلاعات هویتی حساس دارند؛ فقط خود کاربر بتواند بخواند/ویرایش/حذف کند. */
export async function createAddress(userId: string, address: Omit<Address, 'id'>): Promise<Address> {
  const doc = await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.collections.addresses,
    ID.unique(),
    { userId, ...address },
    [Permission.read(Role.user(userId)), Permission.update(Role.user(userId)), Permission.delete(Role.user(userId))],
  );
  return { id: doc.$id, ...address };
}

export async function updateAddress(id: string, address: Omit<Address, 'id'>): Promise<void> {
  await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.collections.addresses, id, address);
}

export async function deleteAddress(id: string): Promise<void> {
  await databases.deleteDocument(appwriteConfig.databaseId, appwriteConfig.collections.addresses, id);
}
