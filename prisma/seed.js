const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@zdn.mn' },
    update: {},
    create: {
      email: 'admin@zdn.mn',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
    },
  })

  console.log('✅ Default admin user created:', admin.email)

  // Create some sample categories
  const category1 = await prisma.category.create({
    data: {
      name: 'Эрэмбэ хүчний хэмжээ, хэмжилт төхөөрөмж',
      description: 'Хэмжилт төхөөрөмж',
    },
  })

  const category2 = await prisma.category.create({
    data: {
      name: 'Бол бүтээгдэхүүн',
      description: 'Бүтээгдэхүүний төрөл',
    },
  })

  console.log('✅ Sample categories created')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

