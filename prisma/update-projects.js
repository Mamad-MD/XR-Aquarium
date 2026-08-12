const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('در حال به‌روزرسانی پروژه‌ها...');

  // نمونه به‌روزرسانی پروژه سیستم ناوبری واقعیت افزوده
  await prisma.project.update({
    where: { id: 'p2' },
    data: {
      titleFa: 'سیستم ناوبری واقعیت افزوده پردیس',
      description: 'اپلیکیشن مسیریابی داخل سالن و پردیس دانشگاه با استفاده از واقعیت افزوده و تکنولوژی SLAM.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop',
    },
  });

  // می‌توانی بقیه پروژه‌ها (p1 تا p20) را هم همین‌جا به فارسی ویرایش کنی.
  console.log('پروژه‌ها با موفقیت فارسی شدند ✅');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
