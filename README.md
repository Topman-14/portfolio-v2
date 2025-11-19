# Portfolio V2

A modern, full-featured portfolio website built with Next.js 15, featuring a blog, project showcase, experience management, and an admin dashboard.

## 🚀 Features

### Public Features
- **Portfolio Showcase**: Display featured projects with images, descriptions, and links
- **Blog System**: Full-featured blog with categories, tags, comments, and reading time
- **Experience Timeline**: Showcase work experience with skills and achievements
- **Newsletter Subscription**: Email subscription functionality
- **3D Animations**: Interactive 3D elements powered by Spline
- **PWA Support**: Progressive Web App capabilities for offline access
- **Responsive Design**: Mobile-first, fully responsive design
- **Dark Mode**: Theme switching support

### Admin Features
- **Dashboard**: Analytics and metrics overview
- **Content Management**: 
  - Article management with rich text editor (TipTap)
  - Work/Project management
  - Experience management
  - Category management
- **Analytics**: Charts and statistics for articles, reads, and engagement
- **Authentication**: Secure admin authentication with NextAuth

## 🛠️ Tech Stack

### Core
- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + SCSS
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)

### Key Libraries
- **Authentication**: NextAuth v5 (beta)
- **UI Components**: Radix UI primitives
- **Rich Text Editor**: TipTap
- **Animations**: GSAP, Lottie, Spline
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **State Management**: Zustand
- **Image Optimization**: Next.js Image + Cloudinary
- **PWA**: next-pwa

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm, yarn, pnpm, or bun

## 🏗️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Topman-14/portfolio-v2.git
cd portfolio-v2
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio_db?schema=public"

# NextAuth
AUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Cloudinary (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

**Generate AUTH_SECRET**:
```bash
openssl rand -base64 32
```

### 4. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

### 5. Create Admin User

```bash
npm run createsuperuser
```

Follow the prompts to create your first admin user.

### 6. (Optional) Seed Database

Populate the database with sample data:

```bash
npm run seed
```

This creates:
- 1 admin user (email: `admin@example.com`, password: `password123`)
- 10 categories
- 30 articles
- 50 comments
- 15 experiences
- 20 works

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
portfolio-v2/
├── app/                      # Next.js App Router
│   ├── (pages)/             # Route groups
│   │   ├── (web)/           # Public pages
│   │   │   ├── about/       # About page
│   │   │   ├── blog/        # Blog listing
│   │   │   └── work/        # Work showcase
│   │   └── admin/           # Admin dashboard
│   │       ├── articles/    # Article management
│   │       ├── work/        # Work management
│   │       ├── experience/  # Experience management
│   │       └── categories/  # Category management
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── newsletter/     # Newsletter subscription
│   │   ├── works/          # Works API
│   │   └── experiences/    # Experiences API
│   └── layout.tsx          # Root layout
├── components/              # React components
│   ├── admin/              # Admin-specific components
│   ├── animations/         # Animation components
│   ├── charts/             # Dashboard charts
│   ├── custom/             # Custom components
│   ├── dashboard/          # Dashboard components
│   ├── generic-form/       # Reusable form components
│   ├── tiptap/             # TipTap editor components
│   ├── ui/                 # UI primitives (shadcn/ui)
│   └── web/                # Public-facing components
├── lib/                    # Utility functions
│   ├── constants.ts        # App constants
│   ├── prismadb.ts         # Prisma client
│   ├── rate-limit.ts       # Rate limiting
│   └── utils.ts            # General utilities
├── prisma/                 # Prisma schema and migrations
│   └── schema.prisma       # Database schema
├── scripts/                # Utility scripts
│   ├── create-superuser.ts # Admin user creation
│   └── seed.ts             # Database seeding
├── hooks/                  # Custom React hooks
├── context/                # React context providers
├── types/                  # TypeScript type definitions
└── public/                 # Static assets
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following main models:

- **User**: Admin users with roles (ADMIN, SUPER_ADMIN)
- **Article**: Blog posts with status (DRAFT, PUBLISHED, ARCHIVED)
- **Category**: Article categories
- **Comment**: Article comments
- **Work**: Portfolio projects
- **Experience**: Work experience entries
- **NewsletterSubscription**: Email subscriptions

## 🚀 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run createsuperuser` - Create an admin user
- `npm run seed` - Seed database with sample data

## 🔐 Authentication

The admin section is protected by NextAuth. Users must have ADMIN or SUPER_ADMIN role to access admin routes.

**Sign in**: `/auth/sign-in`

## 📝 Admin Routes

- `/admin` - Dashboard overview
- `/admin/articles` - Article management
- `/admin/work` - Work/Project management
- `/admin/experience` - Experience management
- `/admin/categories` - Category management

## 🎨 Customization

### Update Site Information

Edit `lib/constants.ts` to update:
- Base URL
- Navigation items
- Social links
- Contact email


## 🗺️ Roadmap

Upcoming features and improvements planned for the project:

### Storage & Media
- [ ] **AWS S3 Integration**: Add support for AWS S3 as an alternative to Cloudinary for image and file storage
- [ ] **OG Images**: Implement dynamic Open Graph image generation for blog posts and pages

### Content & Features
- [ ] **Featured Blogs on Landing**: Display featured blog posts on the homepage
- [ ] **Spotify Current Track**: Integrate Spotify API to display currently playing track

### UI/UX Improvements
- [ ] **Update Hero Text**: Refine and improve the hero section text for better clarity and impact 😅

### Attribution & Credits
- [ ] **3D Assets Attribution**: Add proper attribution and credits for 3D assets used in the project

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute to this project.

## 📄 License

See [LICENSE](./LICENSE) file for details.

## 👤 Author

**Tope Akinkuade**

<!-- - Website: [tops.dev](https://tops.dev) -->
- LinkedIn: [@tope-akinkuade](https://www.linkedin.com/in/tope-akinkuade/)
- Twitter: [@therealtope_](https://www.twitter.com/therealtope_)
- GitHub: [@Topman-14](https://www.github.com/Topman-14)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide](https://lucide.dev/)
- Fonts: Bricolage Grotesque, Krona One, Syne
