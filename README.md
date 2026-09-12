# DigiMarket — بازارچه آنلاین خرید و فروش محصولات

پروژه‌ای واقعی (نه Demo) برای یک Marketplace فارسی و RTL، ساخته‌شده با **React + Vite + TypeScript + Tailwind CSS** و **Appwrite** (Authentication، Database، Storage).

نام و متن‌های برند در فایل [`src/config/brand.ts`](./src/config/brand.ts) متمرکز شده‌اند — برای تغییر نام پروژه فقط همان فایل را ویرایش کنید. رنگ‌بندی برند هم در [`src/styles/theme.css`](./src/styles/theme.css) متمرکز است.

---

## فهرست

1. [پیش‌نیازها](#۱-پیش‌نیازها)
2. [نصب و اجرای سریع](#۲-نصب-و-اجرای-سریع)
3. [ساخت پروژه در Appwrite](#۳-ساخت-پروژه-در-appwrite)
4. [ساخت Database و Collectionها](#۴-ساخت-database-و-collectionها)
5. [ساخت Storage Buckets](#۵-ساخت-storage-buckets)
6. [تنظیم Environment Variables](#۶-تنظیم-environment-variables)
7. [اجرا، Build و Deploy](#۷-اجرا-build-و-deploy)
8. [ساختار پروژه](#۸-ساختار-پروژه)
9. [وضعیت فعلی پیاده‌سازی و گام‌های بعدی](#۹-وضعیت-فعلی-پیاده‌سازی-و-گام‌های-بعدی)
10. [نکات امنیتی مهم](#۱۰-نکات-امنیتی-مهم)
11. [عیب‌یابی](#۱۱-عیب‌یابی)

---

## ۱. پیش‌نیازها

- **Node.js نسخه ۱۸ یا بالاتر** (نسخه ۲۰ توصیه می‌شود) — از [nodejs.org](https://nodejs.org/) دانلود کنید. نصب Node.js به‌طور خودکار `npm` را هم نصب می‌کند.
- یک حساب کاربری رایگان در [Appwrite Cloud](https://cloud.appwrite.io) (یا یک نمونه Appwrite Self-Hosted روی سرور خودتان).
- **ویندوز:** می‌توانید فقط با دابل‌کلیک روی `RUN.bat` مراحل نصب و اجرا را خودکار انجام دهید (توضیح کامل در بخش ۷).

بررسی نصب بودن Node.js:
```bash
node -v
npm -v
```

---

## ۲. نصب و اجرای سریع

```bash
# ۱. نصب وابستگی‌ها
npm install

# ۲. کپی فایل نمونه Environment Variables
cp .env.example .env
# (در ویندوز: copy .env.example .env)

# ۳. مقادیر Appwrite را داخل .env تکمیل کنید — بخش‌های ۳ تا ۶ همین فایل را ببینید

# ۴. اجرای سرور توسعه
npm run dev
```

سپس آدرس `http://localhost:5173` را در مرورگر باز کنید.

> **نکته:** پروژه بدون تکمیل `.env` هم بالا می‌آید و صفحات فروشگاه/خانه با داده‌های نمایشی (mock) کار می‌کنند، اما بخش‌های Authentication، سبد خرید دیتابیسی، سفارش، Wishlist، پنل فروشنده و پنل ادمین نیاز به یک پروژه Appwrite واقعی دارند.

---

## ۳. ساخت پروژه در Appwrite

1. وارد [cloud.appwrite.io](https://cloud.appwrite.io) شوید (یا پنل Appwrite Self-Hosted خودتان را باز کنید) و یک **Project** جدید بسازید.
2. از منوی **Auth → Settings**، روش ورود **Email/Password** را فعال کنید.
3. از منوی **Auth → Settings → Security**، دامنه‌ای که پروژه روی آن اجرا می‌شود (مثلاً `http://localhost:5173` برای توسعه، و دامنه نهایی سایت برای Production) را به **Platforms** اضافه کنید (نوع Platform: **Web App**).
4. از منوی **Auth → Teams**، یک Team جدید با نام دقیق **`admins`** بسازید. هر کاربری که باید نقش ادمین داشته باشد را (بعد از ثبت‌نام عادی در سایت) به این Team اضافه کنید. این Team برای مجوزهای امنیتی سطح سند (بخش ۱۰) استفاده می‌شود.
5. Project ID را از **Settings → General** کپی کنید — بعداً در `.env` لازم است.

---

## ۴. ساخت Database و Collectionها

از منوی **Databases** یک Database جدید بسازید (مثلاً با نام `digimarket`) و ID آن را یادداشت کنید.

سپس Collectionهای زیر را دقیقاً با همین Attributeها بسازید. برای هرکدام، پس از ساخت Attributeها، Indexهای پیشنهادی را هم اضافه کنید.

> راهنمای خواندن جدول‌ها: ستون «الزامی» یعنی Required بودن Attribute در Appwrite. نوع `Enum` باید از نوع String با گزینه‌های مشخص‌شده ساخته شود.

### 4.1 `users`

| Attribute | نوع | الزامی | توضیح |
|---|---|---|---|
| name | String (255) | بله | نام و نام خانوادگی |
| username | String (30) | بله | نام کاربری یکتا |
| email | String (255) | بله | ایمیل |
| role | Enum: `user`, `seller`, `admin` | بله | نقش کاربر — پیش‌فرض `user` |
| avatarUrl | String (2000) | خیر | لینک تصویر پروفایل |
| suspended | Boolean | خیر | پیش‌فرض `false` |
| createdAt | String (64) | خیر | تاریخ ثبت‌نام (ISO) |

- **⚠️ نکته حیاتی:** Document ID این Collection باید دقیقاً برابر با Appwrite Auth User ID باشد. کد پروژه (`authService.ts`) این کار را به‌طور خودکار انجام می‌دهد؛ نیازی به تنظیم دستی نیست.
- **Indexes:** یک Index از نوع `Fulltext` روی `name` بسازید (برای جست‌وجوی کاربران در پنل ادمین).
- **Permissions (سطح Collection):**
  - Create: `Users` (هر کاربر لاگین‌شده)
  - Read: `Any`
  - Update: `Users` *(برای توسعه سریع؛ پیش از انتشار نهایی حتماً بخش ۱۰ را درباره سخت‌سازی فیلد `role` بخوانید)*
  - Delete: `Team: admins`

### 4.2 `sellers` (درخواست‌های فروشندگی + پروفایل فروشنده تأییدشده)

| Attribute | نوع | الزامی |
|---|---|---|
| userId | String (64) | بله |
| storeName | String (255) | بله |
| description | String (2000) | بله |
| storeImageUrl | String (2000) | خیر |
| phone | String (32) | بله |
| status | Enum: `pending`, `approved`, `rejected` | بله (پیش‌فرض `pending`) |
| rejectionReason | String (500) | خیر |
| rating | Float | خیر (پیش‌فرض ۰) |
| totalSales | Integer | خیر (پیش‌فرض ۰) |
| productCount | Integer | خیر (پیش‌فرض ۰) |

- **Indexes:** Key Index روی `userId`، Key Index روی `status`.
- **Permissions:** Create: `Users` · Read: `Any` · Update: `Users`, `Team: admins` · Delete: `Team: admins`

### 4.3 `products`

| Attribute | نوع | الزامی |
|---|---|---|
| sellerId | String (64) | بله |
| sellerName | String (255) | بله |
| name | String (255) | بله |
| slug | String (255) | بله |
| description | String (5000) | بله |
| price | Integer | بله |
| compareAtPrice | Integer | خیر |
| stock | Integer | بله |
| sku | String (64) | بله |
| categoryId | String (64) | بله |
| images | String (2000), **Array** | بله |
| tags | String (64), **Array** | خیر |
| attributes | String (4000) | خیر (JSON.stringify شده) |
| status | Enum: `pending`, `approved`, `rejected` | بله (پیش‌فرض `pending`) |
| rejectionReason | String (500) | خیر |
| rating | Float | خیر (پیش‌فرض ۰) |
| reviewCount | Integer | خیر (پیش‌فرض ۰) |
| salesCount | Integer | خیر (پیش‌فرض ۰) |

- **Indexes:** Key Index روی `sellerId`، Key Index روی `status`، Key Index روی `categoryId`، Fulltext روی `name`.
- **Permissions:** Create: `Users` · Read: `Any` · Update: `Users`, `Team: admins` · Delete: `Users`, `Team: admins`
- تنها محصولات با `status = approved` باید در فروشگاه عمومی فیلتر و نمایش داده شوند (منطق آن سمت Query در فاز اتصال نهایی اضافه می‌شود — بخش ۹ را ببینید).

### 4.4 `categories`

| Attribute | نوع | الزامی |
|---|---|---|
| name | String (255) | بله |
| slug | String (255) | بله |
| icon | String (64) | خیر |
| imageUrl | String (2000) | خیر |
| productCount | Integer | خیر (پیش‌فرض ۰) |

- **Permissions:** Create: `Team: admins` · Read: `Any` · Update: `Team: admins` · Delete: `Team: admins`

### 4.5 `orders`

| Attribute | نوع | الزامی |
|---|---|---|
| userId | String (64) | بله |
| subtotal | Integer | بله |
| discount | Integer | بله |
| shippingCost | Integer | بله |
| total | Integer | بله |
| status | Enum: `pending`, `paid`, `processing`, `shipped`, `delivered`, `cancelled` | بله |
| paymentStatus | Enum: `unpaid`, `paid`, `failed`, `refunded` | بله |
| address | String (2000) | بله (JSON.stringify شده) |

- **⚠️ این Collection حاوی اطلاعات حساس (آدرس/تماس) است.** حتماً از **Document Security** استفاده کنید:
  1. روی Collection وارد **Settings** شوید و گزینه **Document Security** را فعال کنید.
  2. Permission سطح Collection را خالی/محدود بگذارید (فقط `Team: admins` برای Read در حالت اضطراری).
  3. کد پروژه (`orderService.ts`) هنگام ساخت هر سفارش، به‌صورت خودکار Permission سطح سند برای «همان کاربر» و «تیم admins» تنظیم می‌کند — نیازی به کار دستی اضافه نیست، فقط باید Document Security را در Console فعال کرده باشید.
- **Indexes:** Key Index روی `userId`.

### 4.6 `order_items`

| Attribute | نوع | الزامی |
|---|---|---|
| orderId | String (64) | بله |
| productId | String (64) | بله |
| sellerId | String (64) | بله |
| name | String (255) | بله |
| image | String (2000) | خیر |
| price | Integer | بله |
| quantity | Integer | بله |

- این Collection اطلاعات هویتی حساس ندارد (فقط نام/قیمت/تعداد کالا)، بنابراین Permission سطح Collection کافی است.
- **Indexes:** Key Index روی `orderId`، Key Index روی `sellerId`.
- **Permissions:** Create: `Users` · Read: `Users` · Update: `Team: admins` · Delete: `Team: admins`

### 4.7 `cart`

این Collection برای همگام‌سازی سبد خرید کاربران لاگین‌شده بین دستگاه‌های مختلف در نظر گرفته شده (در نسخه فعلی، سبد خرید در `localStorage` مرورگر نگه‌داری می‌شود — بخش ۹ را ببینید). ساختار پیشنهادی برای پیاده‌سازی کامل:

| Attribute | نوع | الزامی |
|---|---|---|
| userId | String (64) | بله |
| productId | String (64) | بله |
| quantity | Integer | بله |

- **Permissions:** Create/Read/Update/Delete: `Users` (با Document Security برای مالکیت هر سند)

### 4.8 `wishlist`

| Attribute | نوع | الزامی |
|---|---|---|
| userId | String (64) | بله |
| productId | String (64) | بله |
| addedAt | String (64) | خیر |

- **Indexes:** Key Index روی `userId`، Key Index ترکیبی روی `userId`+`productId` (اختیاری، برای جلوگیری از رکورد تکراری).
- کد پروژه هنگام افزودن به علاقه‌مندی‌ها Permission سطح سند برای همان کاربر تنظیم می‌کند؛ **Document Security** را برای این Collection هم فعال کنید.

### 4.9 `reviews`

| Attribute | نوع | الزامی |
|---|---|---|
| productId | String (64) | بله |
| userId | String (64) | بله |
| userName | String (255) | بله |
| rating | Integer (1 تا 5) | بله |
| comment | String (2000) | بله |

- **Indexes:** Key Index روی `productId`.
- **Permissions:** Create: `Users` · Read: `Any` · Update: `Users` · Delete: `Users`, `Team: admins`
- طبق الزام پروژه، فقط خریدار واقعی محصول باید بتواند نظر ثبت کند. برای اجرای دقیق این قانون در Production، یک Appwrite Function پیشنهاد می‌شود که پیش از ایجاد سند Review، سفارش‌های Delivered کاربر برای آن محصول را بررسی کند (نکات بیشتر در بخش ۱۰).

### 4.10 `seller_requests`

این همان Collection شماره ۴.۲ (`sellers`) است — طبق پیشنهاد سند اصلی پروژه، درخواست فروشندگی و پروفایل فروشنده تأییدشده در یک Collection واحد نگهداری می‌شوند (فیلد `status` تفاوت را مشخص می‌کند). نیازی به ساخت Collection جداگانه نیست؛ ID همان Collection شماره ۴.۲ را در متغیر `VITE_APPWRITE_SELLER_REQUESTS_COLLECTION_ID` هم قرار دهید.

### 4.11 `notifications`

| Attribute | نوع | الزامی |
|---|---|---|
| userId | String (64) | بله |
| title | String (255) | بله |
| message | String (1000) | بله |
| read | Boolean | بله (پیش‌فرض `false`) |

- **Indexes:** Key Index روی `userId`.
- **Permissions:** Create: `Team: admins` (یا از طریق یک Appwrite Function هنگام رویدادهایی مثل تأیید محصول) · Read: `Users` · Update: `Users` · Delete: `Team: admins`

### 4.12 `addresses`

*(این Collection نسبت به لیست پیشنهادی سند اصلی پروژه اضافه شده تا آدرس‌های چندگانه کاربر پشتیبانی شود.)*

| Attribute | نوع | الزامی |
|---|---|---|
| userId | String (64) | بله |
| fullName | String (255) | بله |
| province | String (100) | بله |
| city | String (100) | بله |
| addressLine | String (500) | بله |
| postalCode | String (20) | بله |
| phone | String (32) | بله |

- **⚠️ اطلاعات حساس** — **Document Security** را فعال کنید. کد پروژه هنگام ساخت هر آدرس، Permission سطح سند برای همان کاربر تنظیم می‌کند.
- **Indexes:** Key Index روی `userId`.

---

## ۵. ساخت Storage Buckets

از منوی **Storage** سه Bucket بسازید:

| Bucket | استفاده | Permissions پیشنهادی |
|---|---|---|
| `product-images` | تصاویر محصولات | Create: `Users` · Read: `Any` · Update/Delete: `Users`, `Team: admins` |
| `avatars` | تصویر پروفایل کاربران | Create: `Users` · Read: `Any` · Update/Delete: `Users` |
| `store-images` | تصویر فروشگاه‌ها و دسته‌بندی‌ها | Create: `Users` · Read: `Any` · Update/Delete: `Users`, `Team: admins` |

برای هرکدام، حداکثر حجم فایل مناسب (مثلاً ۵ مگابایت) و فرمت‌های مجاز (`jpg`, `png`, `webp`) را در تنظیمات Bucket محدود کنید.

---

## ۶. تنظیم Environment Variables

فایل `.env` را باز کنید و مقادیر زیر را با IDهای واقعی که در بخش‌های ۳ تا ۵ ساختید پر کنید:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=<Project ID از بخش ۳>
VITE_APPWRITE_DATABASE_ID=<Database ID از بخش ۴>

VITE_APPWRITE_USERS_COLLECTION_ID=<Collection ID>
VITE_APPWRITE_SELLERS_COLLECTION_ID=<همان Collection بخش ۴.۲>
VITE_APPWRITE_PRODUCTS_COLLECTION_ID=<Collection ID>
VITE_APPWRITE_CATEGORIES_COLLECTION_ID=<Collection ID>
VITE_APPWRITE_ORDERS_COLLECTION_ID=<Collection ID>
VITE_APPWRITE_ORDER_ITEMS_COLLECTION_ID=<Collection ID>
VITE_APPWRITE_CART_COLLECTION_ID=<Collection ID>
VITE_APPWRITE_WISHLIST_COLLECTION_ID=<Collection ID>
VITE_APPWRITE_REVIEWS_COLLECTION_ID=<Collection ID>
VITE_APPWRITE_SELLER_REQUESTS_COLLECTION_ID=<همان Collection بخش ۴.۲>
VITE_APPWRITE_NOTIFICATIONS_COLLECTION_ID=<Collection ID>
VITE_APPWRITE_ADDRESSES_COLLECTION_ID=<Collection ID>

VITE_APPWRITE_PRODUCT_IMAGES_BUCKET_ID=<Bucket ID>
VITE_APPWRITE_AVATARS_BUCKET_ID=<Bucket ID>
VITE_APPWRITE_STORE_IMAGES_BUCKET_ID=<Bucket ID>
```

اگر از Appwrite Self-Hosted استفاده می‌کنید، `VITE_APPWRITE_ENDPOINT` را به آدرس سرور خودتان (مثلاً `https://appwrite.example.com/v1`) تغییر دهید.

> پس از تغییر `.env`، سرور توسعه (`npm run dev`) را متوقف و دوباره اجرا کنید تا مقادیر جدید خوانده شوند.

---

## ۷. اجرا، Build و Deploy

### اجرای توسعه

```bash
npm run dev
```

### اجرای خودکار در ویندوز (`RUN.bat`)

فایل `RUN.bat` در ریشه پروژه قرار دارد. با **دابل‌کلیک** روی آن:
1. بررسی می‌کند Node.js نصب است یا نه (در صورت نبود، لینک دانلود را نشان می‌دهد).
2. اگر فایل `.env` وجود نداشته باشد، آن را از روی `.env.example` می‌سازد (باید بعداً مقادیر Appwrite را در آن تکمیل کنید — بخش ۶).
3. اگر پوشه `node_modules` وجود نداشته باشد، `npm install` را خودکار اجرا می‌کند.
4. سرور توسعه را در یک پنجره جدید اجرا کرده و مرورگر را روی `http://localhost:5173` باز می‌کند.

برای توقف پروژه، کافیست پنجره‌ای که با عنوان «DigiMarket Dev Server» باز شده را ببندید.

### Build نهایی

```bash
npm run build
```

خروجی در پوشه `dist/` ساخته می‌شود. برای پیش‌نمایش محلی خروجی Build:

```bash
npm run preview
```

### Deploy

**Vercel:**
پروژه را به یک ریپازیتوری گیت متصل کنید و در Vercel Import کنید. فایل `vercel.json` (که در ریشه پروژه قرار دارد) به‌طور خودکار تمام مسیرها را به `index.html` هدایت می‌کند تا Routing سمت کلاینت درست کار کند. متغیرهای بخش ۶ را در تنظیمات Environment Variables پروژه Vercel هم وارد کنید.

**Netlify:**
فایل `public/_redirects` از قبل برای Routing تنظیم شده است. دستور Build: `npm run build`، پوشه Publish: `dist`.

**GitHub Pages:**
1. در `vite.config.ts`، مقدار `base` را به نام ریپازیتوری خود تغییر دهید (مثلاً `base: '/digimarket/'`).
2. فایل `public/404.html` (تریک استاندارد SPA برای GitHub Pages) از قبل آماده است — فقط اگر پروژه روی یک **User/Org Page** یا دامنه اختصاصی قرار می‌گیرد (نه Project Page)، مقدار `segmentCount` داخل همان فایل را از `1` به `0` تغییر دهید.
3. خروجی `npm run build` (پوشه `dist`) را روی GitHub Pages منتشر کنید.

---

## ۸. ساختار پروژه

```
src/
  components/     # کامپوننت‌های Reusable (ui, layout, product, checkout, home)
  pages/          # صفحات (dashboard/, seller/, admin/ برای پنل‌های اختصاصی)
  layouts/        # چیدمان‌های صفحه (MainLayout, AuthLayout, DashboardLayout, SellerLayout, AdminLayout)
  hooks/          # هوک‌های سفارشی (useDebouncedValue)
  services/       # لایه ارتباط با Appwrite (authService, productService, orderService, ...)
  lib/            # اتصال Appwrite (appwrite.ts) و داده‌های نمایشی (mockData.ts)
  utils/          # ابزارهای فرمت اعداد/قیمت/تاریخ، کلاس‌بندی و غیره
  types/          # تایپ‌های TypeScript مشترک
  context/        # React Context برای Auth، Cart، Wishlist، Toast
  routes/         # تعریف تمام مسیرها (AppRoutes.tsx) و ProtectedRoute
  config/         # تنظیمات برند (brand.ts)
  styles/         # فایل تم مرکزی رنگ (theme.css)
```

---

## ۹. وضعیت فعلی پیاده‌سازی و گام‌های بعدی

برای شفافیت کامل، این بخش دقیقاً مشخص می‌کند کدام قسمت‌ها به‌طور کامل به Appwrite واقعی متصل‌اند و کدام قسمت‌ها فعلاً از داده نمایشی (mock) استفاده می‌کنند:

**کاملاً متصل به Appwrite واقعی:**
- ثبت‌نام، ورود، خروج، فراموشی/بازیابی رمز عبور، تغییر رمز عبور (`authService.ts`)
- علاقه‌مندی‌ها (Wishlist)، آدرس‌ها، سفارش‌ها و سبد پرداخت (Checkout)
- درخواست فروشندگی و بررسی آن توسط ادمین
- افزودن/ویرایش/حذف محصول توسط فروشنده (شامل آپلود تصویر در Storage) و تأیید/رد توسط ادمین
- مدیریت کاربران، دسته‌بندی‌ها و نظرات در پنل ادمین
- اعلان‌ها (خواندن و علامت‌گذاری به‌عنوان خوانده‌شده)

**فعلاً از داده نمایشی (mock) استفاده می‌کند و باید در گام بعدی به Query واقعی Appwrite وصل شود:**
- توابع **خواندنی عمومی** محصولات (`getProducts`, `getProductById`, `getRelatedProducts`, `getProductsByIds` در `src/services/productService.ts`) — این توابع در حال حاضر از `src/lib/mockData.ts` می‌خوانند تا صفحات فروشگاه/خانه/دسته‌بندی حتی بدون دیتابیس واقعی هم قابل نمایش و تست باشند. توابع **نوشتنی** (`createProduct`, `updateProduct`, `deleteProduct`, `listSellerProducts`, ...) از همان ابتدا مستقیماً با Appwrite کار می‌کنند. برای اتصال کامل، فقط کافیست بدنه توابع خواندنی در همان فایل با `databases.listDocuments(...)` جایگزین شود؛ امضای توابع و کدهای صفحات نیازی به تغییر ندارند.
- لیست دسته‌بندی‌ها و فروشندگان در صفحه اصلی/فروشگاه از `mockData.ts` می‌آید؛ سرویس‌های واقعی (`categoryService.ts`, `sellerService.listAllSellers`) از قبل آماده‌اند و فقط باید در همین صفحات جایگزین شوند.
- نمودارهای فروش در پنل فروشنده/ادمین (`SalesChart`) با داده نمونه پر شده‌اند؛ برای مقادیر واقعی باید یک تابع تجمیع (Aggregation) بر پایه `orderService.listAllOrders` / `listSellerOrders` به تفکیک روز/هفته نوشته شود.
- درگاه پرداخت (`paymentService.ts`) یک شبیه‌سازی امن (Mock) است — طراحی آن طوری است که با جایگزینی بدنه دو تابع `requestPayment` و `verifyPayment` (برای فراخوانی یک Appwrite Function متصل به درگاه واقعی)، بدون نیاز به تغییر صفحه Checkout قابل اتصال به یک درگاه واقعی (زرین‌پال و مشابه) است.
- بخش تنظیمات پلتفرم در پنل ادمین (`AdminSettings`) فقط نمایشی است؛ ویرایش برند از طریق فایل `src/config/brand.ts` انجام می‌شود.

---

## ۱۰. نکات امنیتی مهم

این پروژه با در نظر گرفتن اصول امنیتی زیر ساخته شده، اما چند مورد نیاز به تکمیل توسط تیم Backend/DevOps قبل از انتشار عمومی دارند:

1. **تغییر نقش کاربر (Role):** در حال حاضر `adminService.updateUserRole` مستقیماً از سمت کلاینت (با Session ادمین) سند کاربر را به‌روزرسانی می‌کند. چون Appwrite Permission در سطح کل سند اعمال می‌شود (نه هر Attribute جداگانه)، اگر Permission سطح Collection برای Update به کاربران عادی هم داده شود، تئوریاً امکان دستکاری وجود دارد. **راه‌حل پیشنهادی برای Production:** یک Appwrite Function با API Key سمت سرور بسازید که پیش از تغییر `role`، بررسی کند درخواست‌دهنده واقعاً عضو Team `admins` است، و `adminService.updateUserRole` را طوری تغییر دهید که به‌جای فراخوانی مستقیم `databases.updateDocument`، همان Function را صدا بزند.
2. **صحت قیمت و موجودی در Checkout:** تابع `orderService.createOrder` فعلاً به مقادیر ارسالی از Client (`subtotal`, `total` و غیره) اعتماد می‌کند. **راه‌حل پیشنهادی:** یک Appwrite Function بسازید که پیش از ساخت سند Order، قیمت و موجودی واقعی هر محصول را از Collection `products` بخواند، مجموع را دوباره محاسبه کند، و در صورت مغایرت درخواست را رد کند. سپس فقط همان Function اجازه ساخت سند Order را داشته باشد.
3. **Document Security:** حتماً طبق بخش ۴ برای Collectionهای `orders`، `addresses` و `wishlist` گزینه Document Security را در Appwrite Console فعال کنید تا Permission سطح سندی که کد پروژه هنگام ساخت هر رکورد تنظیم می‌کند، واقعاً اعمال شود.
4. **بررسی خریدار واقعی برای ثبت نظر:** طبق الزام پروژه، فقط خریداران واقعی باید بتوانند نظر ثبت کنند. این بررسی باید در یک Appwrite Function پیش از ساخت سند `reviews` انجام شود (بررسی وجود سفارش Delivered از همان کاربر برای همان محصول).
5. **هرگز Secret Key در Frontend قرار ندهید.** تمام کلیدهای API درگاه پرداخت یا سرویس‌های شخص ثالث فقط باید در Appwrite Functions (سمت سرور) نگهداری شوند.

---

## ۱۱. عیب‌یابی

| مشکل | راه‌حل |
|---|---|
| صفحه سفید بعد از اجرا | Console مرورگر را چک کنید؛ معمولاً به‌خاطر مقدار نادرست `VITE_APPWRITE_ENDPOINT` یا `PROJECT_ID` در `.env` است. |
| خطای CORS از Appwrite | آدرس دامنه (یا `localhost:5173`) را در **Auth → Settings → Platforms** پروژه Appwrite اضافه کنید. |
| خطای Permission Denied هنگام ثبت‌نام یا خرید | Permissionهای Collection مربوطه را طبق جدول‌های بخش ۴ دوباره بررسی کنید. |
| `npm install` با خطا متوقف می‌شود | نسخه Node.js را با `node -v` بررسی کنید؛ باید ۱۸ یا بالاتر باشد. |
| رفرش صفحه در مسیرهای داخلی (`/shop`, `/product/۱`) باعث 404 می‌شود | روی Vercel/Netlify فایل‌های `vercel.json`/`public/_redirects` باید در ریشه Deploy باشند؛ روی GitHub Pages مطمئن شوید `public/404.html` منتشر شده و مقدار `segmentCount` درست تنظیم شده (بخش ۷). |

---

هر بازخورد یا گزارش اشکالی دارید، از طریق ایمیل پشتیبانی که در `src/config/brand.ts` تنظیم کرده‌اید پیگیری کنید.
