import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateUserRole() {
  try {
    // Update the user with email admin@example.com to have ADMIN role
    const updatedUser = await prisma.user.update({
      where: {
        email: 'admin@example.com'
      },
      data: {
        role: 'ADMIN'
      }
    })

    console.log('User updated successfully:', updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateUserRole() 