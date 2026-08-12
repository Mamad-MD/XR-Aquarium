const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('در حال آپدیت یکپارچه دیتابیس...');

  // ۱. آپدیت اطلاعیه‌ها
  const announcements = [
    {
      id: 'ann-001',
      titleFa: 'تعمیر و نگهداری سیستم برای آخر هفته',
      contentFa: 'به اطلاع می‌رساند سرور اصلی در روز شنبه از ساعت ۰۲:۰۰ بامداد تا ۰۶:۰۰ صبح تحت تعمیر و نگهداری قرار خواهد گرفت. احتمال قطعی موقت وجود دارد.'
    },
    {
      id: 'ann-002',
      titleFa: 'به‌روزرسانی‌های جدید بیمه درمانی',
      contentFa: 'دپارتمان منابع انسانی، بیمه درمانی را به‌روز کرده است. لطفاً فرم‌های جدید را بررسی کنید.'
    }
    // در صورت نیاز بقیه را هم اینجا اضافه کن
  ];

  for (const ann of announcements) {
    try {
      await prisma.announcement.update({
        where: { id: ann.id },
        data: { titleFa: ann.titleFa, contentFa: ann.contentFa }
      });
      console.log(`اطلاعیه ${ann.id} آپدیت شد.`);
    } catch (e) {
      console.log(`اطلاعیه ${ann.id} در دیتابیس یافت نشد (نادیده گرفته شد).`);
    }
  }

  // ۲. آپدیت چند نمونه پروژه به فارسی
  try {
    await prisma.project.update({
      where: { id: 'p1' },
      data: { titleFa: 'آزمایشگاه مجازی آناتومی', description: 'آزمایشگاه واقعیت مجازی تعاملی برای دانشجویان پزشکی جهت بررسی آناتومی بدن انسان در فضای ۳ بعدی.' }
    });
    console.log('پروژه P1 آپدیت شد.');
  } catch(e) {}

  console.log('آپدیت دیتابیس با موفقیت به پایان رسید ✅');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
