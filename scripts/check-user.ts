import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: 'admin@example.com'
      }
    })

    console.log('Current user status:', user)
  } catch (error) {
    console.error('Error checking user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUser() 