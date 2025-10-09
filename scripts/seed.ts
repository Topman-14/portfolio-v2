import { PrismaClient, UserRole, ArticleStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const categories = [
  { name: 'Web Development', description: 'Articles about web development technologies and practices' },
  { name: 'React', description: 'React.js tutorials, tips, and best practices' },
  { name: 'Next.js', description: 'Next.js framework guides and tutorials' },
  { name: 'TypeScript', description: 'TypeScript programming language articles' },
  { name: 'Database', description: 'Database design and management articles' },
  { name: 'DevOps', description: 'DevOps practices and tools' },
  { name: 'UI/UX', description: 'User interface and user experience design' },
  { name: 'JavaScript', description: 'JavaScript programming articles' },
  { name: 'Node.js', description: 'Node.js backend development' },
  { name: 'CSS', description: 'CSS styling and design techniques' }
];

const articleTitles = [
  'Getting Started with React Hooks',
  'Building Scalable Next.js Applications',
  'TypeScript Best Practices for Large Projects',
  'Database Optimization Techniques',
  'Modern CSS Grid Layouts',
  'Understanding JavaScript Closures',
  'Docker for Frontend Developers',
  'Creating Accessible Web Components',
  'State Management in React Applications',
  'API Design Best Practices',
  'Testing React Components with Jest',
  'Performance Optimization in Next.js',
  'Advanced TypeScript Patterns',
  'PostgreSQL vs MongoDB: A Comparison',
  'CSS-in-JS vs Traditional CSS',
  'JavaScript ES6+ Features You Should Know',
  'CI/CD Pipeline Setup with GitHub Actions',
  'Design Systems: Building Consistent UIs',
  'React Server Components Deep Dive',
  'GraphQL vs REST API',
  'Web Security Best Practices',
  'Responsive Design Principles',
  'Node.js Performance Tips',
  'CSS Animations and Transitions',
  'JavaScript Memory Management',
  'Microservices Architecture Patterns',
  'Progressive Web Apps Guide',
  'React Native vs Flutter',
  'Database Migration Strategies',
  'Frontend Build Tools Comparison'
];

const companies = [
  'Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix', 'Spotify', 'Uber', 'Airbnb', 'Twitter',
  'LinkedIn', 'GitHub', 'Stripe', 'Shopify', 'Slack', 'Discord', 'Zoom', 'Tesla', 'SpaceX', 'OpenAI'
];

const jobTitles = [
  'Senior Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'DevOps Engineer', 'UI/UX Designer', 'Product Manager', 'Technical Lead', 'Software Architect',
  'Mobile Developer', 'Data Engineer', 'Cloud Engineer', 'Security Engineer', 'QA Engineer'
];

const workTitles = [
  'E-commerce Platform', 'Social Media Dashboard', 'Task Management App', 'Real-time Chat Application',
  'Weather App', 'Recipe Finder', 'Expense Tracker', 'Blog Platform', 'Portfolio Website',
  'Learning Management System', 'Fitness Tracker', 'Music Streaming App', 'Travel Planner',
  'Online Marketplace', 'Project Management Tool', 'Video Conferencing App', 'Food Delivery App',
  'Banking Application', 'Healthcare Portal', 'Gaming Platform'
];

const tools = [
  'React', 'Next.js', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Redis',
  'Docker', 'AWS', 'Vercel', 'Tailwind CSS', 'Material-UI', 'GraphQL', 'Apollo',
  'Jest', 'Cypress', 'Git', 'GitHub', 'Figma', 'Sketch', 'Adobe XD'
];

const skills = [
  'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java',
  'Go', 'Rust', 'SQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Azure',
  'Git', 'CI/CD', 'Agile', 'Scrum', 'Leadership', 'Problem Solving', 'Communication'
];

const achievements = [
  'Led team of 5 developers to deliver project 2 weeks ahead of schedule',
  'Improved application performance by 40% through code optimization',
  'Implemented CI/CD pipeline reducing deployment time by 60%',
  'Designed and developed microservices architecture serving 1M+ users',
  'Reduced bug reports by 50% through comprehensive testing strategy',
  'Mentored 3 junior developers who were promoted within 6 months',
  'Successfully migrated legacy system to modern tech stack',
  'Implemented security measures preventing 99.9% of potential vulnerabilities',
  'Optimized database queries resulting in 70% faster response times',
  'Built scalable system handling 10x traffic increase during peak times'
];

const comments = [
  'Great article! Very helpful for beginners.',
  'Thanks for sharing this detailed guide.',
  'I learned something new today. Keep it up!',
  'This solved my problem perfectly.',
  'Excellent explanation with clear examples.',
  'Bookmarked for future reference.',
  'Very informative content.',
  'Thanks for the practical tips.',
  'This is exactly what I was looking for.',
  'Amazing work! Looking forward to more articles.'
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const user = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin User',
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      }
    });

    console.log('✅ User created:', user.email);

    const createdCategories = [];
    for (const category of categories) {
      const created = await prisma.category.upsert({
        where: { name: category.name },
        update: {},
        create: {
          name: category.name,
          description: category.description,
          slug: generateSlug(category.name),
          userId: user.id
        }
      });
      createdCategories.push(created);
    }

    console.log('✅ Categories created:', createdCategories.length);

    for (let i = 0; i < 30; i++) {
      const title = articleTitles[i];
      const status = getRandomElement([ArticleStatus.PUBLISHED, ArticleStatus.DRAFT, ArticleStatus.ARCHIVED]);
      const publishedAt = status === ArticleStatus.PUBLISHED ? getRandomDate(new Date(2023, 0, 1), new Date()) : null;
      
      await prisma.article.create({
        data: {
          title,
          slug: generateSlug(title),
          content: `<h1>${title}</h1><p>This is a comprehensive article about ${title.toLowerCase()}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p><h2>Key Points</h2><ul><li>Important concept 1</li><li>Important concept 2</li><li>Important concept 3</li></ul><p>In conclusion, ${title.toLowerCase()} is an essential topic for modern developers. Understanding these concepts will help you build better applications.</p>`,
          excerpt: `Learn about ${title.toLowerCase()} with this comprehensive guide covering best practices and real-world examples.`,
          coverImg: `https://images.unsplash.com/photo-${1500000000000 + i}?w=800&h=400&fit=crop`,
          status,
          reads: Math.floor(Math.random() * 1000) + 10,
          readTime: Math.floor(Math.random() * 15) + 3,
          tags: getRandomElements(['javascript', 'react', 'nextjs', 'typescript', 'webdev', 'tutorial', 'guide'], 3),
          publishedAt,
          userId: user.id,
          categoryId: getRandomElement(createdCategories).id
        }
      });
    }

    console.log('✅ Articles created: 30');

    const articles = await prisma.article.findMany();
    for (let i = 0; i < 50; i++) {
      const article = getRandomElement(articles);
      await prisma.comment.create({
        data: {
          text: getRandomElement(comments),
          email: `user${i}@example.com`,
          articleId: article.id
        }
      });
    }

    console.log('✅ Comments created: 50');

    for (let i = 0; i < 15; i++) {
      const startDate = getRandomDate(new Date(2020, 0, 1), new Date(2023, 0, 1));
      const endDate = Math.random() > 0.3 ? getRandomDate(startDate, new Date()) : null;
      
      await prisma.experience.create({
        data: {
          jobTitle: getRandomElement(jobTitles),
          company: getRandomElement(companies),
          location: getRandomElement(['San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Remote']),
          description: `Worked as a ${getRandomElement(jobTitles).toLowerCase()} at ${getRandomElement(companies)}, focusing on ${getRandomElement(['frontend development', 'backend systems', 'mobile apps', 'cloud infrastructure', 'data analysis'])}. Led multiple projects and collaborated with cross-functional teams to deliver high-quality solutions.`,
          startDate,
          endDate,
          isCurrentRole: !endDate,
          skills: getRandomElements(skills, Math.floor(Math.random() * 8) + 5),
          achievements: getRandomElements(achievements, Math.floor(Math.random() * 3) + 1),
          userId: user.id
        }
      });
    }

    console.log('✅ Experiences created: 15');

    for (let i = 0; i < 20; i++) {
      await prisma.work.create({
        data: {
          title: getRandomElement(workTitles),
          description: `A comprehensive ${getRandomElement(workTitles).toLowerCase()} built with modern technologies. Features include ${getRandomElement(['user authentication', 'real-time updates', 'responsive design', 'data visualization', 'API integration'])} and more.`,
          image: `https://images.unsplash.com/photo-${1600000000000 + i}?w=600&h=400&fit=crop`,
          videoUrl: Math.random() > 0.7 ? `https://example.com/demo${i}.mp4` : null,
          tools: getRandomElements(tools, Math.floor(Math.random() * 6) + 3),
          githubLink: `https://github.com/user/project${i}`,
          liveUrl: `https://project${i}.vercel.app`,
          featured: Math.random() > 0.6,
          category: getRandomElement(['Web App', 'Mobile App', 'Desktop App', 'API', 'Library']),
          userId: user.id
        }
      });
    }

    console.log('✅ Works created: 20');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log('- Users: 1');
    console.log('- Categories: 10');
    console.log('- Articles: 30');
    console.log('- Comments: 50');
    console.log('- Experiences: 15');
    console.log('- Works: 20');
    console.log('\n🔑 Admin credentials:');
    console.log('- Email: admin@example.com');
    console.log('- Password: password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
