import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'development' },
      update: {},
      create: {
        name: 'Development',
        slug: 'development',
        description: 'Software development articles',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'tutorial' },
      update: {},
      create: {
        name: 'Tutorial',
        slug: 'tutorial',
        description: 'Step-by-step guides',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'news' },
      update: {},
      create: {
        name: 'News',
        slug: 'news',
        description: 'Latest updates and news',
      },
    }),
  ])

  // Create sample posts
  const posts = await Promise.all([
    prisma.post.upsert({
      where: { slug: 'getting-started-with-nextjs-14' },
      update: {},
      create: {
        title: 'Getting Started with Next.js 14',
        slug: 'getting-started-with-nextjs-14',
        content: 'Next.js 14 introduces the App Router, a new paradigm for building React applications...',
        excerpt: 'Learn how to build modern web applications with Next.js 14 and its new App Router.',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorId: adminUser.id,
        categories: {
          connect: [{ id: categories[0].id }, { id: categories[1].id }],
        },
      },
    }),
    prisma.post.upsert({
      where: { slug: 'building-a-modern-cms' },
      update: {},
      create: {
        title: 'Building a Modern CMS',
        slug: 'building-a-modern-cms',
        content: 'Content Management Systems have evolved significantly over the years...',
        excerpt: 'Explore the architecture and technologies behind modern content management systems.',
        status: 'DRAFT',
        authorId: adminUser.id,
        categories: {
          connect: [{ id: categories[1].id }],
        },
      },
    }),
    prisma.post.upsert({
      where: { slug: 'typescript-best-practices' },
      update: {},
      create: {
        title: 'TypeScript Best Practices',
        slug: 'typescript-best-practices',
        content: 'TypeScript has become the standard for building scalable JavaScript applications...',
        excerpt: 'Discover the best practices for writing maintainable TypeScript code.',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorId: adminUser.id,
        categories: {
          connect: [{ id: categories[0].id }],
        },
      },
    }),
  ])

  console.log('Database seeded successfully!')
  console.log('Admin user created:', adminUser.email)
  console.log('Categories created:', categories.length)
  console.log('Posts created:', posts.length)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 