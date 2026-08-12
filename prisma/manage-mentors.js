/**
 * اسکریپت مدیریت منتورها
 * ----------------------
 * این اسکریپت دو کار می‌کند:
 * ۱) نام فارسی (nameFa) و نقش فارسی (roleFa) هر منتور را در دیتابیس ثبت می‌کند.
 * ۲) بر اساس مقدار visible که خودتان پایین همین فایل تنظیم می‌کنید،
 *    مشخص می‌کند کدام منتور در سایت نمایش داده شود و کدام مخفی بماند.
 *
 * نحوه استفاده:
 * ۱. این فایل را داخل پوشه‌ی prisma پروژه (کنار seed.ts) قرار دهید.
 * ۲. برای هر منتور که می‌خواهید مخفی شود، مقدار visible را false کنید.
 * ۳. در ترمینال، داخل پوشه‌ی اصلی پروژه دستور زیر را اجرا کنید:
 *      node prisma/manage-mentors.js
 * ۴. سرور را دوباره اجرا کنید (npm run dev) و صفحه‌ی اصلی را رفرش کنید.
 *
 * نکته مهم: این اسکریپت هیچ داده‌ای (پروژه‌ها، حساب‌های کاربری واقعی و ...) را پاک نمی‌کند،
 * فقط اطلاعات همین ۱۳ نفر لیست زیر را به‌روزرسانی می‌کند.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const mentors = [
  { id: 't1',  name: 'Mohammad Parsa Golbou', nameFa: 'محمد پارسا گل‌بو', role: 'Event Secretary & XR Core Team Member', roleFa: 'دبیر رویداد و عضو هسته XR', image: '/avatar/imaget1.jpg', visible: true },
  { id: 't2',  name: 'Mohammad Mosayebi',     nameFa: 'محمد مسیبی',       role: 'Deputy Event Secretary & XR Core Team Member', roleFa: 'نائب دبیر رویداد و عضو هسته XR', image: '/avatar/imaget1.jpg', visible: true },
  { id: 't3',  name: 'Ali Najjarzadegan',     nameFa: 'علی نجارزادگان',   role: 'Technical Lead, Mentor & XR Core Team Member', roleFa: 'منتور، هد فنی و عضو هسته XR', image: '/avatar/imaget1.jpg', visible: true },
  { id: 't4',  name: 'Iman Imani',            nameFa: 'ایمان ایمانی',     role: 'Mentor', roleFa: 'منتور', image: 'https://i.pravatar.cc/150?u=iman-imani', visible: true },

  // این‌ها منتورهای «نامشخص» (TBD) هستن. مقدار visible هرکدوم رو که
  // می‌خوای مخفی بشه، false کن. الان همه‌شون false گذاشتم (مخفی) چون
  // اطلاعات واقعی‌شون هنوز مشخص نیست. هروقت اسم واقعی رو داشتی،
  // name/nameFa/role/roleFa رو پر کن و visible رو true کن.
  { id: 't5',  name: 'TBD', nameFa: 'نامشخص', role: 'Mentor', roleFa: 'منتور', image: 'https://i.pravatar.cc/150?u=t5',  visible: false },
  { id: 't6',  name: 'TBD', nameFa: 'نامشخص', role: 'Mentor', roleFa: 'منتور', image: 'https://i.pravatar.cc/150?u=t6',  visible: false },
  { id: 't7',  name: 'TBD', nameFa: 'نامشخص', role: 'Mentor', roleFa: 'منتور', image: 'https://i.pravatar.cc/150?u=t7',  visible: false },
  { id: 't8',  name: 'TBD', nameFa: 'نامشخص', role: 'Mentor', roleFa: 'منتور', image: 'https://i.pravatar.cc/150?u=t8',  visible: false },
  { id: 't9',  name: 'TBD', nameFa: 'نامشخص', role: 'Mentor', roleFa: 'منتور', image: 'https://i.pravatar.cc/150?u=t9',  visible: false },
  { id: 't10', name: 'TBD', nameFa: 'نامشخص', role: 'Mentor', roleFa: 'منتور', image: 'https://i.pravatar.cc/150?u=t10', visible: false },
  { id: 't11', name: 'TBD', nameFa: 'نامشخص', role: 'Mentor', roleFa: 'منتور', image: 'https://i.pravatar.cc/150?u=t11', visible: false },
  { id: 't12', name: 'TBD', nameFa: 'نامشخص', role: 'Mentor', roleFa: 'منتور', image: 'https://i.pravatar.cc/150?u=t12', visible: false },
  { id: 't13', name: 'TBD', nameFa: 'نامشخص', role: 'Mentor', roleFa: 'منتور', image: 'https://i.pravatar.cc/150?u=t13', visible: false },
];

async function main() {
  console.log('در حال به‌روزرسانی منتورها...');

  for (const m of mentors) {
    await prisma.user.update({
      where: { id: m.id },
      data: {
        name: m.name,
        nameFa: m.nameFa,
        role: m.visible ? m.role : 'MENTOR_HIDDEN',
        roleFa: m.roleFa,
        image: m.image,
        isVisible: m.visible,
      },
    });
    console.log(`  - ${m.id} (${m.nameFa}) → ${m.visible ? 'نمایش داده می‌شود' : 'مخفی شد'}`);
  }

  console.log('تمام شد ✅');
}

main()
  .catch((e) => {
    console.error('خطا:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
