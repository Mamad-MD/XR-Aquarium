const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Get all users with MENTOR or EXECUTIVE role
  const existingMentors = await prisma.user.findMany({
    where: {
      role: {
        in: ['MENTOR', 'EXECUTIVE']
      }
    }
  })

  // Delete existing mentors but check constraints
  for (const mentor of existingMentors) {
    try {
      await prisma.user.delete({
        where: { id: mentor.id }
      })
    } catch (e) {
      // If it's referenced somewhere, just update it instead to be safe
      // or set it to a regular user so it doesn't show up in mentor queries
      await prisma.user.update({
        where: { id: mentor.id },
        data: { role: 'PARTICIPANT' }
      })
    }
  }

  // The new exact list you provided
  const newMentors = [
    {
      id: 't1',
      name: 'Mohammad Parsa Golbou',
      nameFa: 'محمد پارسا گل‌بو',
      role: 'Event Secretary & XR Core Team Member',
      roleFa: 'دبیر رویداد و عضو هسته XR',
      image: '/avatar/imaget1.jpg'
    },
    {
      id: 't2',
      name: 'Mohammad Mosayebi',
      nameFa: 'محمد مسیبی',
      role: 'Deputy Event Secretary & XR Core Team Member',
      roleFa: 'نائب دبیر رویداد و عضو هسته XR',
      image: '/avatar/imaget1.jpg'
    },
    {
      id: 't3',
      name: 'Ali Najjarzadegan',
      nameFa: 'علی نجارزادگان',
      role: 'Technical Lead, Mentor & XR Core Team Member',
      roleFa: 'منتور، هد فنی و عضو هسته XR',
      image: '/avatar/imaget1.jpg'
    },
    {
      id: 't4',
      name: 'Iman Imani',
      nameFa: 'ایمان ایمانی',
      role: 'Mentor',
      roleFa: 'منتور',
      image: 'https://i.pravatar.cc/150?u=iman-imani'
    },
    {
      id: 't5',
      name: 'TBD',
      nameFa: 'نامشخص',
      role: 'Mentor',
      roleFa: 'منتور',
      image: 'https://i.pravatar.cc/150?u=t5'
    },
    {
      id: 't6',
      name: 'TBD',
      nameFa: 'نامشخص',
      role: 'Mentor',
      roleFa: 'منتور',
      image: 'https://i.pravatar.cc/150?u=t6'
    },
    {
      id: 't7',
      name: 'TBD',
      nameFa: 'نامشخص',
      role: 'Mentor',
      roleFa: 'منتور',
      image: 'https://i.pravatar.cc/150?u=t7'
    },
    {
      id: 't8',
      name: 'TBD',
      nameFa: 'نامشخص',
      role: 'Mentor',
      roleFa: 'منتور',
      image: 'https://i.pravatar.cc/150?u=t8'
    },
    {
      id: 't9',
      name: 'TBD',
      nameFa: 'نامشخص',
      role: 'Mentor',
      roleFa: 'منتور',
      image: 'https://i.pravatar.cc/150?u=t9'
    },
    {
      id: 't10',
      name: 'TBD',
      nameFa: 'نامشخص',
      role: 'Mentor',
      roleFa: 'منتور',
      image: 'https://i.pravatar.cc/150?u=t10'
    }
  ]

  for (const mentor of newMentors) {
    await prisma.user.upsert({
      where: { id: mentor.id },
      update: mentor,
      create: mentor
    })
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })