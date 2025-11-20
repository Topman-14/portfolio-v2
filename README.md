# Portfolio v2

A modern portfolio website built with Next.js 15, featuring a public-facing site and an admin dashboard for content management.

## Features

- **Public Portfolio**: Showcase work, blog articles, and personal information
- **Admin Dashboard**: Manage articles, work projects, experiences, and categories
- **Rich Text Editor**: TipTap-powered editor for content creation
- **Authentication**: NextAuth with role-based access control (Admin/Super Admin)
- **Animations**: GSAP-powered animations and smooth scrolling
- **PWA Support**: Progressive Web App capabilities
- **Image Management**: Cloudinary integration for media handling

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth v5
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Animations**: GSAP, Lenis
- **Rich Text**: TipTap
- **State Management**: Zustand, TanStack Query

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd portfolio-v2
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - Secret for NextAuth (generate with `openssl rand -base64 32`)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` - Cloudinary upload preset

4. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```

5. Create a super admin user:
```bash
npm run createsuperuser
```

6. (Optional) Seed the database, you may as well update the seed file for different content:
```bash
npm run seed
```

7. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run createsuperuser` - Create a super admin user
- `npm run seed` - Seed the database with sample data

## Project Structure

```
├── app/              # Next.js app router pages
│   ├── (pages)/      # Route groups
│   │   ├── (web)/    # Public-facing pages
│   │   └── admin/    # Admin dashboard
│   └── api/          # API routes
├── components/       # React components
│   ├── admin/       # Admin-specific components
│   ├── web/         # Public site components
│   └── ui/          # Reusable UI components
├── lib/             # Utility functions
├── hooks/           # Custom React hooks
├── prisma/          # Prisma schema and migrations
└── types/           # TypeScript type definitions
```

## Roadmap

Planned features and improvements:

- [ ] Add Spotify section
- [ ] Update hero text
- [ ] Add OG images
- [ ] Build the blog
- [ ] Implement newsletter section in admin dashboard
- [ ] Add simple mail client functionality
- [ ] Add support for AWS S3

## Contributing

Contributions are welcome! Please read the [Contributing Guide](CONTRIBUTING.md) for details.


## License

See [LICENSE](LICENSE) file for details.
