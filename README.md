# Modern CMS with Next.js 14

A modern Content Management System built with Next.js 14, TypeScript, Prisma, and tRPC.

## 🚀 Features

- **Modern Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with role-based access control
- **Database**: PostgreSQL with Prisma ORM
- **API**: tRPC for type-safe API calls
- **UI**: Shadcn/ui components with beautiful design
- **State Management**: Zustand for client-side state
- **Validation**: Zod for schema validation

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cms-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your database URL and NextAuth secret:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/cms_db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed the database with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Default Credentials

After seeding the database, you can log in with:

- **Email**: admin@example.com
- **Password**: password123

## 📁 Project Structure

```
cms-project/
├── src/
│   ├── app/                 # App Router (Next.js 14)
│   │   ├── (auth)/         # Authentication routes
│   │   ├── admin/          # Admin panel routes
│   │   ├── api/            # API routes
│   │   └── (public)/       # Public routes
│   ├── components/         # Reusable components
│   │   ├── ui/            # Shadcn components
│   │   ├── forms/         # Form components
│   │   ├── layout/        # Layout components
│   │   ├── auth/          # Authentication components
│   │   └── dashboard/     # Dashboard components
│   ├── lib/               # Utilities and configuration
│   │   ├── routers/       # tRPC routers
│   │   ├── auth.ts        # NextAuth configuration
│   │   ├── db.ts          # Prisma client
│   │   ├── trpc.ts        # tRPC configuration
│   │   └── router.ts      # Main tRPC router
│   ├── hooks/             # Custom hooks
│   ├── store/             # Zustand stores
│   ├── types/             # TypeScript types
│   └── styles/            # Global styles
├── prisma/                # Database schema and migrations
├── public/                # Static assets
└── docs/                  # Documentation
```

## 🎯 Key Features

### Authentication & Authorization
- Role-based access control (Admin, Editor, Author)
- Protected routes with middleware
- Session management with NextAuth.js

### Content Management
- **Posts**: Create, edit, delete, and publish posts
- **Categories**: Organize content with categories
- **Users**: Manage user roles and permissions
- **Dashboard**: Overview of content and statistics

### Modern Development Experience
- Type-safe API calls with tRPC
- Real-time form validation with Zod
- Beautiful UI with Shadcn/ui
- Responsive design with Tailwind CSS

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data

## 🔧 Configuration

### Database
The project uses PostgreSQL with Prisma ORM. Update the `DATABASE_URL` in your `.env.local` file to point to your PostgreSQL instance.

### Authentication
NextAuth.js is configured with credentials provider. You can add additional providers (Google, GitHub, etc.) in `src/lib/auth.ts`.

### Environment Variables
Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Your application URL
- `NEXTAUTH_SECRET`: Secret key for NextAuth.js

## 🎨 Customization

### Adding New Components
Components are organized in the `src/components` directory:
- `ui/`: Shadcn/ui components
- `forms/`: Form components
- `layout/`: Layout components
- `auth/`: Authentication components

### Adding New API Routes
API routes are handled through tRPC routers in `src/lib/routers/`. Add new routers and include them in the main router in `src/lib/router.ts`.

### Styling
The project uses Tailwind CSS with Shadcn/ui components. Custom styles can be added in `src/app/globals.css`.

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The project can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

Built with ❤️ using Next.js 14, TypeScript, and modern web technologies.
