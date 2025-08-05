import { UserRole, PostStatus } from '@prisma/client'

export interface User {
  id: string
  name: string | null
  email: string | null
  role: UserRole
  image: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featuredImage: string | null
  status: PostStatus
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
  // SEO Fields
  metaTitle: string | null
  metaDescription: string | null
  focusKeyword: string | null
  ogImage: string | null
  canonicalUrl: string | null
  // Analytics
  viewCount: number
  authorId: string
  author: User
  categories: Category[]
  tags: Tag[]
  views?: PostView[]
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  createdAt: Date
  updatedAt: Date
  posts: Post[]
  _count?: {
    posts: number
  }
}

export interface Session {
  user: {
    id: string
    name: string | null
    email: string | null
    role: UserRole
    image: string | null
  }
  expires: string
}

export interface DashboardStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalCategories: number
  totalUsers: number
}

export interface CreatePostInput {
  title: string
  slug: string
  content: string
  excerpt?: string
  featuredImage?: string
  status: PostStatus
  categoryIds: string[]
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
  id: string
}

export interface CreateCategoryInput {
  name: string
  slug: string
  description?: string
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  id: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  description: string | null
  color: string
  createdAt: Date
  updatedAt: Date
  posts?: Post[]
  _count?: {
    posts: number
  }
}

export interface PostView {
  id: string
  postId: string
  userAgent: string | null
  ipAddress: string | null
  country: string | null
  referer: string | null
  createdAt: Date
}

export interface CreateTagInput {
  name: string
  slug: string
  description?: string
  color?: string
}

export interface UpdateTagInput extends Partial<CreateTagInput> {
  id: string
}

export interface PostAnalytics {
  totalViews: number
  uniqueViews: number
  viewsToday: number
  viewsThisWeek: number
  viewsThisMonth: number
  topReferrers: { referer: string; count: number }[]
  viewsByDay: { date: string; views: number }[]
} 