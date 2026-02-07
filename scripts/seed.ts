import { PrismaClient, UserRole } from '@prisma/client';
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


const experiences = [
  {
    jobTitle: "Fullstack Engineer | Contract",
    company: "Binta Financial",
    location: "Remote",
    description: "At Binta Financial, I took on a variety of responsibilities that spanned fullstack development and system architecture. I launched the company's website in just three weeks, including a full-featured blog, webinar hub, and careers section. I worked extensively with TypeScript, Node.js, React, and Strapi to design a custom CMS and admin panel that allowed non-technical teams to manage content independently. Additionally, I engineered a Retrieval-Augmented Generation (RAG) application using LangChain and PGVector with NestJS, implementing real-time token streaming via Socket.IO and backend rate limiting to handle high volumes of queries. I also designed and deployed a unified cross-domain authentication system supporting both client and server-to-server flows across web products and React Native mobile apps, while establishing centralized testing, monitoring, and automated CI/CD pipelines for onboarding new developers.",
    startDate: "2024-12-01T00:00:00.000Z",
    endDate: null,
    isCurrentRole: true,
    skills: ["TypeScript","Node.js","React","Strapi","LangChain","PGVector","NestJS","Socket.IO","CI/CD"],
    achievements: ["Launched full-featured company website in 3 weeks","Built RAG application with real-time streaming","Implemented cross-domain auth system"]
  },
  {
    jobTitle: "Frontend Engineer | Contract",
    company: "Compass AI",
    location: "Remote",
    description: "I developed the ReactJS client for an AI-powered LMS built on Django. My work involved creating real-time audio streaming interfaces and custom UI components like dynamic module calendars and course views from scratch. I collaborated closely with backend developers to ensure seamless integration with AI-powered learning features.",
    startDate: "2024-08-01T00:00:00.000Z",
    endDate: "2024-12-31T00:00:00.000Z",
    isCurrentRole: false,
    skills: ["React","JavaScript","TypeScript","Django integration","WebRTC"],
    achievements: ["Built complex, dynamic UI components for AI LMS","Implemented real-time audio streaming for course content"]
  },
  {
    jobTitle: "Fullstack Engineer | Contract",
    company: "Husridge Limited",
    location: "Remote",
    description: "I bolstered the engineering team to build a well-received MVP featuring a Node.js-based application layer with multiple microservices, a React client, and a document-object store. My work included integrating seamlessly with third-party services like Dojah. I contributed to building scalable features while ensuring high-quality code and maintainable architecture.",
    startDate: "2025-03-01T00:00:00.000Z",
    endDate: "2025-07-31T00:00:00.000Z",
    isCurrentRole: false,
    skills: ["Node.js","React","Microservices","Integration","Document-store"],
    achievements: ["Contributed to MVP launch","Integrated third-party services successfully"]
  },
  {
    jobTitle: "Frontend Engineer | Part-time",
    company: "Lengoal",
    location: "Remote",
    description: "I played a pivotal role in crafting an e-learning platform using Next.js, delivering an intuitive, engaging experience for modern learners with WebRTC technology. I collaborated with backend teams and designers to revamp the codebase, introducing mobile-first interfaces while maintaining high-quality and maintainable code.",
    startDate: "2024-06-01T00:00:00.000Z",
    endDate: "2025-07-31T00:00:00.000Z",
    isCurrentRole: false,
    skills: ["Next.js","React","WebRTC","Frontend development","UI/UX"],
    achievements: ["Revamped codebase for mobile-first interfaces","Enhanced learner experience with WebRTC integration"]
  },
  {
    jobTitle: "Frontend Engineer",
    company: "Kobo360 Logistics",
    location: "Lagos, Nigeria",
    description: "I contributed to a ReactJS fleet management SaaS intended to expand the company's truck logistics offerings. I was heavily involved in building a price estimation module for the Angular-based CRM software, which increased customer retention and reduced sales overhead by 48 hours. My work focused on scalable frontend architecture and improving usability for internal users.",
    startDate: "2024-02-01T00:00:00.000Z",
    endDate: "2024-08-31T00:00:00.000Z",
    isCurrentRole: false,
    skills: ["React","Angular","Frontend development","Fleet management SaaS"],
    achievements: ["Developed price estimation module","Improved user workflow and retention"]
  }
];

const works = [
  {
    title: "Testfinancial.com — Company Site & CMS",
    image: 'https://res.cloudinary.com/doaq5feum/image/upload/v1763801674/qirnxf1ofdwcz7curqu4.png',
    description: "I still remember the first week on BintaFinancial.com, everything was new, and it felt like stepping onto a live battlefield of data and users. My goal was to create a site that allowed marketing, growth, and product teams to publish content without constant engineering support. I mapped out the CMS structure, designed semantic SEO-friendly pages, and implemented incremental static regeneration so blog and webinar content could update seamlessly. Working with Strapi as a headless CMS, I had to create a robust schema for articles, webinars, ebooks, and careers that could evolve over time. I also built a cross-domain authentication system, handling both client and server-to-server flows, and introduced token streaming endpoints to preview large content efficiently. Watching the site go live and seeing teams publish autonomously made every late night worth it. Each challenge, from content migration scripts to live rate-limiting for our RAG-based internal search, taught me a lot about scaling real-world web platforms.",
    videoUrl: null,
    tools: ["TypeScript","Next.js","React","Strapi","Node.js","Tailwind","Postgres","Prisma","Socket.IO","LangChain","PGVector"],
    githubLink: null,
    liveUrl: "https://bintafinancial.com",
    featured: true,
    category: "Company Sites"
  },
  {
    title: "Topmart — Full Stack Ecommerce (storefront + admin)",
    description: "Working on Topmart, I had to balance the speed and responsiveness of the storefront with the full functionality of the admin dashboard. I designed an intuitive store interface where users could browse, filter, and purchase products seamlessly while the admin panel enabled sellers to manage inventory, handle orders, and configure Paystack payments. Using Next.js and TypeScript, I optimized server-side rendering and caching to ensure SEO and performance were top-notch. The admin panel used ShadCN UI for consistent design and responsive layouts. Handling asynchronous payment flows, ensuring idempotency, and reconciling order and payment state was tricky but satisfying. Each deployment refined usability, and watching real users complete orders without friction was extremely rewarding. The codebases, both client and admin, reflect careful attention to modularity, maintainability, and UX design.",
    videoUrl: null,
    image: 'https://res.cloudinary.com/doaq5feum/image/upload/v1763802008/sligvjkr6losfijsvelk.png',
    tools: ["TypeScript","Next.js","React","ShadCN UI","Paystack","MongoDB Atlas","Vercel","Tailwind"],
    githubLink: "https://github.com/Topman-14/topmart-client",
    liveUrl: null,
    featured: true,
    category: "Ecommerce"
  },
  {
    title: "MedSync — AI Powered Electronic Health Records",
    description: "MedSync was perhaps the most meaningful project I have contributed to. Clinics were struggling with fragmented patient data and inefficient workflows. I focused on building modules for centralized electronic health records with AI-powered summarization and fast retrieval. Using PGVector and LangChain, I enabled smart search for clinicians while keeping privacy and encryption at the forefront. I documented workflows extensively in Notion, iterated on prototypes, and optimized the system for speed and usability. Integrating existing clinic systems and handling sensitive medical data pushed me to implement careful audit trails and secure transformation pipelines. It was incredibly rewarding to see the system streamline patient lookup and billing processes. Each refinement, every user feedback session, reinforced the importance of building technology that tangibly improves healthcare delivery.",
    videoUrl: null,
    tools: ["TypeScript","Node.js","Postgres","PGVector","LangChain","Docker","OpenAI APIs"],
    image: 'https://res.cloudinary.com/doaq5feum/image/upload/v1763802008/sligvjkr6losfijsvelk.png',
    githubLink: null,
    liveUrl: null,
    featured: true,
    category: "HealthTech"
  },
  {
    title: "Hireflow — AI Powered Applicant Tracking System",
    description: "Hireflow was a research-driven project where I contributed to building the frontend of an AI-powered ATS. The system allowed recruiters to see candidate pipelines, parse resumes, and evaluate scoring models in real-time. Using React and TypeScript, I designed dashboards, candidate workflows, and interactive elements that made the process intuitive. While my colleague focused on AI and candidate scoring models, I ensured that the UI could handle dynamic updates, complex candidate flows, and visualization of AI recommendations without confusion. Ensuring explainability and avoiding bias in the interface were ongoing challenges. Watching recruiters interact with the system during pilot tests highlighted the value of combining research-driven AI with practical, user-friendly design.",
    videoUrl: null,
    tools: ["React","TypeScript","Django","Postgres","Celery","Redis"],
    image: 'https://res.cloudinary.com/doaq5feum/image/upload/v1763801674/qirnxf1ofdwcz7curqu4.png',
    githubLink: null,
    liveUrl: null,
    featured: false,
    category: "HR Tech"
  },
  {
    title: "Binta Financial — Fullstack Engineer Contract Experience",
    description: "At Binta Financial, I built the company's public website and admin panel, integrating Strapi CMS for content management. I also engineered a RAG-based internal search system using LangChain and PGVector, along with real-time streaming for tokenized outputs. I set up cross-domain authentication, ensuring smooth client and server-to-server flows, and implemented centralized CI/CD pipelines for onboarding new developers. Each feature deployment reinforced my understanding of scaling complex systems and balancing developer velocity with product stability.",
    videoUrl: null,
    tools: ["Next.js","TypeScript","Strapi","LangChain","PGVector","Socket.IO","Prisma"],
    image: 'https://res.cloudinary.com/doaq5feum/image/upload/v1763801674/qirnxf1ofdwcz7curqu4.png',
    githubLink: null,
    liveUrl: null,
    featured: true,
    category: "Experience"
  }
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}


async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const user = await prisma.user.upsert({
      where: { email: 'topeakinkuade78@gmail.com' },
      update: {},
      create: {
        email: 'topeakinkuade78@gmail.com',
        name: 'Tops',
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
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

    for (const experience of experiences) {
      await prisma.experience.create({
        data: {
          jobTitle: experience.jobTitle,
          company: experience.company,
          location: experience.location,
          description: experience.description,
          startDate: new Date(experience.startDate),
          endDate: experience.endDate ? new Date(experience.endDate) : null,
          isCurrentRole: experience.isCurrentRole,
          skills: experience.skills,
          achievements: experience.achievements,
          userId: user.id
        }
      });
    }

    console.log('✅ Experiences created:', experiences.length);

    for (const work of works) {
      await prisma.work.create({
        data: {
          title: work.title,
          description: work.description,
          image: work.image,
          videoUrl: work.videoUrl,
          tools: work.tools,
          githubLink: work.githubLink,
          liveUrl: work.liveUrl,
          featured: work.featured,
          category: work.category,
          userId: user.id
        }
      });
    }

    console.log('✅ Works created:', works.length);

    console.log('🎉 Database seeding completed successfully!'); 
    console.log('\n📊 Summary:');
    console.log('- Users: 1');
    console.log('- Categories:', createdCategories.length);
    console.log('- Experiences:', experiences.length);
    console.log('- Works:', works.length);
    console.log('\n🔑 Admin credentials:');
    console.log('- Email: topeakinkuade78@gmail.com');
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
