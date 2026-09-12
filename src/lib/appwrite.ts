import { Client, Account, Databases, Storage, ID, Query, Permission, Role } from 'appwrite';

/**
 * تمام مقادیر از Environment Variables خوانده می‌شوند.
 * هرگز مقدار واقعی این‌ها را داخل کد قرار ندهید — فایل .env را ببینید.
 */
export const appwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT as string,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID as string,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID as string,

  collections: {
    users: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID as string,
    sellers: import.meta.env.VITE_APPWRITE_SELLERS_COLLECTION_ID as string,
    products: import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID as string,
    categories: import.meta.env.VITE_APPWRITE_CATEGORIES_COLLECTION_ID as string,
    orders: import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID as string,
    orderItems: import.meta.env.VITE_APPWRITE_ORDER_ITEMS_COLLECTION_ID as string,
    cart: import.meta.env.VITE_APPWRITE_CART_COLLECTION_ID as string,
    wishlist: import.meta.env.VITE_APPWRITE_WISHLIST_COLLECTION_ID as string,
    reviews: import.meta.env.VITE_APPWRITE_REVIEWS_COLLECTION_ID as string,
    sellerRequests: import.meta.env.VITE_APPWRITE_SELLER_REQUESTS_COLLECTION_ID as string,
    notifications: import.meta.env.VITE_APPWRITE_NOTIFICATIONS_COLLECTION_ID as string,
    addresses: import.meta.env.VITE_APPWRITE_ADDRESSES_COLLECTION_ID as string,
    addresses: import.meta.env.VITE_APPWRITE_ADDRESSES_COLLECTION_ID as string,
  },

  buckets: {
    productImages: import.meta.env.VITE_APPWRITE_PRODUCT_IMAGES_BUCKET_ID as string,
    avatars: import.meta.env.VITE_APPWRITE_AVATARS_BUCKET_ID as string,
    storeImages: import.meta.env.VITE_APPWRITE_STORE_IMAGES_BUCKET_ID as string,
  },
};

export const client = new Client()
  .setEndpoint(appwriteConfig.endpoint || 'https://cloud.appwrite.io/v1')
  .setProject(appwriteConfig.projectId || '');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { ID, Query, Permission, Role };
