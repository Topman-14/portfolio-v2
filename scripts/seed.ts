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
        email: 'topeakinkuade78+user2@gmail.com',
        name: 'Topman',
        password: hashedPassword,
        role: UserRole.ADMIN,
      }
    });

    // console.log('✅ User created:', user.email);

    // const createdCategories = [];
    // for (const category of categories) {
    //   const created = await prisma.category.upsert({
    //     where: { name: category.name },
    //     update: {},
    //     create: {
    //       name: category.name,
    //       description: category.description,
    //       slug: generateSlug(category.name),
    //       userId: user.id
    //     }
    //   });
    //   createdCategories.push(created);
    // }

    // console.log('✅ Categories created:', createdCategories.length);

    // for (const experience of experiences) {
    //   await prisma.experience.create({
    //     data: {
    //       jobTitle: experience.jobTitle,
    //       company: experience.company,
    //       location: experience.location,
    //       description: experience.description,
    //       startDate: new Date(experience.startDate),
    //       endDate: experience.endDate ? new Date(experience.endDate) : null,
    //       isCurrentRole: experience.isCurrentRole,
    //       skills: experience.skills,
    //       achievements: experience.achievements,
    //       userId: user.id
    //     }
    //   });
    // }

    console.log('✅ Experiences created:', experiences.length);

    // for (const work of works) {
    //   await prisma.work.create({
    //     data: {
    //       title: work.title,
    //       description: work.description,
    //       image: work.image,
    //       videoUrl: work.videoUrl,
    //       tools: work.tools,
    //       githubLink: work.githubLink,
    //       liveUrl: work.liveUrl,
    //       featured: work.featured,
    //       category: work.category,
    //       userId: user.id
    //     }
    //   });
    // }

    for (const article of articles) {
      await prisma.article.create({
        data: {
          ...article,
          slug: generateSlug(article.title),
          userId: user.id,
          tags: article.tags,
        },
      });
    }

    console.log('✅ Works created:', works.length);

    console.log('🎉 Database seeding completed successfully!'); 
    console.log('\n📊 Summary:');
    console.log('- Users: 1');
    // console.log('- Categories:', createdCategories.length);
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



const articles = [
  {
    title: "Building Scalable Real-Time Systems with WebSockets and Redis",
    excerpt: "A deep dive into architecting real-time features that can handle thousands of concurrent connections without falling apart.",
    content: `<h2>Why Real-Time Matters</h2><p>The modern web is built on the expectation of immediacy. Users no longer accept stale data or manual refresh cycles. Whether it's a live chat feature, collaborative editing, stock tickers, or multiplayer game state, the demand for real-time communication between client and server has become a baseline requirement rather than a luxury. In this article, I want to walk through the architecture I've used to build scalable real-time systems, the trade-offs involved, and the lessons learned from production deployments.</p><h2>The WebSocket Foundation</h2><p>HTTP was designed as a request-response protocol. The client asks, the server answers, and the connection closes. WebSockets fundamentally change this dynamic by establishing a persistent, full-duplex connection between client and server. Once the initial HTTP handshake upgrades the connection, both sides can send messages freely without the overhead of new TCP connections or HTTP headers on every exchange.</p><p>In Node.js, libraries like <code>ws</code> or frameworks like Socket.IO abstract much of the low-level WebSocket management. Socket.IO in particular adds automatic reconnection, room-based broadcasting, and fallback to long-polling when WebSockets aren't available. For most applications, Socket.IO is the pragmatic choice because it handles the edge cases that raw WebSockets leave to the developer.</p><h2>The Scaling Problem</h2><p>A single Node.js process can comfortably handle a few thousand concurrent WebSocket connections. But what happens when you need to scale horizontally across multiple server instances? This is where things get interesting. If User A is connected to Server 1 and User B is connected to Server 2, a message from A needs to somehow reach B even though they're on different processes.</p><p>The standard solution is a pub/sub broker, and Redis is the most common choice for this role. When a message arrives at Server 1, it publishes the message to a Redis channel. Server 2, subscribed to that channel, receives the message and forwards it to the appropriate connected clients. This pattern decouples the WebSocket layer from the routing logic and allows you to add or remove server instances without breaking message delivery.</p><h2>Implementing the Redis Adapter</h2><p>Socket.IO provides an official Redis adapter that makes this integration straightforward. You configure each server instance to use the adapter, and Socket.IO handles the pub/sub mechanics transparently. Room joins, leaves, and broadcasts all work across instances as if they were a single server. The configuration is minimal but the impact is significant.</p><p>However, Redis pub/sub has a limitation: messages are fire-and-forget. If a server instance goes down and comes back up, it misses any messages published during the downtime. For chat applications or notification systems where message durability matters, you need a persistence layer alongside the pub/sub mechanism. I typically store messages in PostgreSQL and use Redis pub/sub purely for real-time delivery, with the client fetching missed messages on reconnection.</p><h2>Connection Management and Heartbeats</h2><p>In production, WebSocket connections are surprisingly fragile. Mobile users switch between WiFi and cellular, laptops go to sleep, and network infrastructure between client and server can silently drop connections. Without active connection management, you end up with ghost connections that consume server resources and skew your metrics.</p><p>Heartbeat mechanisms solve this by having the server periodically ping each client. If a client doesn't respond within a timeout window, the server cleans up the connection. Socket.IO handles this automatically with configurable ping intervals and timeouts, but understanding the mechanism is important for tuning performance. Too aggressive and you'll disconnect users on slow networks. Too lenient and you'll accumulate dead connections.</p><h2>Authentication and Security</h2><p>WebSocket connections bypass traditional HTTP middleware, so authentication requires special handling. The cleanest approach is to authenticate during the initial handshake by passing a JWT or session token as a query parameter or in the auth payload. The server validates the token before allowing the connection to upgrade. Once authenticated, you can attach user metadata to the socket instance for use throughout the connection lifecycle.</p><p>Rate limiting is another consideration that's often overlooked. A malicious or buggy client can flood the server with messages, consuming resources and potentially affecting other users. Implementing per-socket rate limiting with a sliding window algorithm prevents abuse while allowing legitimate burst traffic.</p><h2>Lessons from Production</h2><p>After deploying real-time systems serving tens of thousands of concurrent users, a few patterns have consistently proven their value. First, always design for reconnection. Clients will disconnect and reconnect constantly, and your system should handle this gracefully without data loss. Second, separate your real-time transport from your business logic. The WebSocket layer should be a thin delivery mechanism, not a place for complex application logic. Third, monitor connection counts, message throughput, and latency as first-class metrics. Real-time systems fail in ways that traditional request-response applications don't, and visibility into these metrics is essential for diagnosing issues before they become outages.</p>`,
    readTime: 12,
    tags: ["WebSockets", "Redis", "Node.js", "Real-Time", "Architecture"],
    status: ArticleStatus.PUBLISHED,
  },
  {
    title: "Practical TypeScript Patterns for Large React Codebases",
    excerpt: "How to leverage TypeScript beyond basic type annotations to create maintainable, self-documenting React applications at scale.",
    content: `<h2>Beyond Basic Types</h2><p>Most React developers start with TypeScript by adding type annotations to props and state. That's a solid beginning, but TypeScript's type system is far more expressive than simple interface definitions. In large codebases with dozens of contributors, the patterns you choose for typing directly impact developer velocity, refactoring confidence, and the quality of error messages. This article explores the patterns I've found most valuable in production React applications.</p><h2>Discriminated Unions for Component States</h2><p>One of the most powerful TypeScript patterns for React is using discriminated unions to model component states. Instead of a flat interface with optional fields and boolean flags, you define each possible state as a distinct type with a shared discriminant property. Consider a data fetching component: rather than having <code>isLoading</code>, <code>isError</code>, <code>data</code>, and <code>error</code> as independent fields where invalid combinations are possible, you define a union of <code>{ status: 'loading' }</code>, <code>{ status: 'error'; error: Error }</code>, and <code>{ status: 'success'; data: T }</code>. TypeScript's narrowing then guarantees that when you check <code>status === 'success'</code>, the <code>data</code> field is available and correctly typed.</p><p>This pattern eliminates an entire class of bugs where components render in impossible states. It also makes the code self-documenting because the type definition explicitly enumerates every possible state the component can be in.</p><h2>Generic Components with Constraints</h2><p>When building reusable components like tables, lists, or form builders, generics allow you to create components that work with any data shape while maintaining full type safety. A generic <code>DataTable&lt;T&gt;</code> component can accept column definitions typed against <code>T</code>, ensuring that accessor functions and cell renderers always reference valid fields. The key is using constraints (<code>extends</code>) to require minimum shapes when needed without being overly restrictive.</p><p>I've found that the sweet spot is constraining generics to structural requirements rather than specific interfaces. For example, a sortable table only needs <code>T extends Record&lt;string, unknown&gt;</code> rather than requiring items to implement a specific <code>Sortable</code> interface. This keeps components flexible while still catching errors at compile time.</p><h2>Template Literal Types for API Contracts</h2><p>TypeScript's template literal types are underused in React applications. They're particularly valuable for defining API route patterns, event names, or any string that follows a predictable structure. You can define types like <code>type ApiRoute = \`/api/\${Resource}/\${string}\`</code> and get compile-time validation that route strings match the expected format. Combined with mapped types, you can generate typed API client functions directly from your route definitions.</p><h2>The <code>satisfies</code> Operator</h2><p>The <code>satisfies</code> operator, introduced in TypeScript 4.9, solved a long-standing tension between type widening and type checking. Previously, if you wanted to validate that a configuration object matched a specific type, you had to use a type annotation, which would widen the inferred type and lose literal type information. With <code>satisfies</code>, you can validate the shape while preserving the narrow inferred type. This is invaluable for configuration objects, theme definitions, and route maps where you want both validation and literal types.</p><h2>Branded Types for Domain Safety</h2><p>In applications that deal with multiple ID types, currencies, or units, it's easy to accidentally pass a <code>UserId</code> where an <code>OrderId</code> is expected because both are just strings. Branded types solve this by creating nominally distinct types from the same underlying primitive. The pattern uses intersection types with a phantom property that only exists at the type level. Functions that accept a <code>UserId</code> will reject a plain string or an <code>OrderId</code> at compile time, catching bugs that would otherwise only surface at runtime.</p><h2>Strict Prop Typing with Component Composition</h2><p>React's composition model introduces interesting typing challenges. When building compound components like a <code>Tabs</code> component with <code>Tabs.List</code>, <code>Tabs.Trigger</code>, and <code>Tabs.Content</code> sub-components, you need to ensure that the value types flow correctly through the component tree. Using a shared generic context type and constraining child components against it creates a seamless developer experience where type errors surface at the composition site rather than deep inside component internals.</p><p>The investment in these patterns pays off exponentially as a codebase grows. When a team of ten developers can refactor a shared data model and TypeScript immediately highlights every component that needs updating, that's not just type safety, it's architectural confidence.</p>`,
    readTime: 10,
    tags: ["TypeScript", "React", "Patterns", "Architecture", "Frontend"],
    status: ArticleStatus.PUBLISHED,
  },
  {
    title: "Designing a Headless CMS Schema That Won't Haunt You Later",
    excerpt: "Lessons learned from building and evolving CMS schemas for content-heavy applications that need to scale with the business.",
    content: `<h2>The Schema Is the Product</h2><p>When building content-driven applications, the CMS schema is arguably more important than the frontend that renders it. A well-designed schema empowers content teams to work independently, supports SEO requirements, enables content reuse, and adapts to changing business needs without engineering intervention. A poorly designed schema creates constant friction, technical debt, and an ever-growing backlog of "just add this one field" requests. Having built and maintained schemas for several production CMS implementations, I want to share the principles that have served me well.</p><h2>Start with Content Modeling, Not Data Modeling</h2><p>The most common mistake is approaching CMS schema design like database schema design. Engineers instinctively normalize data, create foreign key relationships, and optimize for storage efficiency. But CMS schemas should be modeled around how content is created, edited, and consumed, not how it's stored. This means sitting with content creators and understanding their mental model of the content.</p><p>For a blog platform, the obvious model is an Article with a title, body, author, and category. But content teams think in terms of editorial workflows: drafts need reviewer assignments, published articles need scheduled unpublishing, and archived content needs to remain accessible but hidden from public feeds. Each of these requirements shapes the schema in ways that pure data modeling wouldn't anticipate.</p><h2>Flexible Content with Structured Blocks</h2><p>Rich text editors like TipTap or ProseMirror store content as structured documents, but the real power comes from defining custom block types within the editor. Instead of a single monolithic content field, consider defining blocks for different content purposes: text blocks, code blocks, image galleries, callout boxes, embedded videos, and comparison tables. Each block type has its own schema with typed fields.</p><p>This approach gives content creators the flexibility to compose varied layouts while maintaining structural consistency. It also makes the content portable: you can render the same content differently for web, mobile, email newsletters, or RSS feeds because the structure is semantic rather than presentational.</p><h2>Handling Media and Assets</h2><p>Media management is where many CMS implementations fall short. Storing image URLs as plain strings in content fields creates orphaned assets, makes bulk operations impossible, and loses valuable metadata. Instead, treat media as a first-class entity with its own schema: original URL, optimized variants, alt text, dimensions, file size, upload date, and usage references.</p><p>When an image is used in an article, the relationship should be explicit so you can answer questions like "where is this image used?" and "what happens if I delete it?" This becomes critical when migrating between storage providers or implementing CDN purging strategies.</p><h2>Versioning and Content History</h2><p>Content versioning seems like a nice-to-have until someone accidentally overwrites a carefully crafted article or a stakeholder asks to see what the homepage looked like last month. Implementing content versioning at the schema level means storing each save as an immutable version with metadata about who made the change and when. The current published version is just a pointer to a specific version record.</p><p>This pattern also enables features like scheduled publishing, A/B testing different content versions, and regulatory compliance where content change history must be auditable. The storage overhead is minimal compared to the operational value it provides.</p><h2>Localization from Day One</h2><p>Adding localization to an existing CMS schema is painful. Adding it from the start is straightforward. Even if your application currently serves a single language, structuring content fields as locale-indexed objects rather than flat strings makes future localization a content task rather than an engineering task. The schema change is minimal: instead of <code>title: string</code>, you have <code>title: Record&lt;Locale, string&gt;</code> with a default locale fallback.</p><h2>Schema Evolution and Migration</h2><p>No schema survives first contact with production unchanged. The business will evolve, content needs will shift, and new features will require schema modifications. The key is designing for evolution: use optional fields with sensible defaults for new additions, avoid breaking changes by keeping deprecated fields readable, and implement migration scripts that can transform existing content to match updated schemas.</p><p>Document every schema change, its rationale, and its migration path. Future developers, including future you, will thank you when trying to understand why a field exists or how historical content should be interpreted.</p>`,
    readTime: 11,
    tags: ["CMS", "Schema Design", "Content Modeling", "Architecture"],
    status: ArticleStatus.PUBLISHED,
  },
  {
    title: "Server Components Changed How I Think About Data Fetching",
    excerpt: "Moving from client-side fetching to server components wasn't just a code change — it was a fundamental shift in application architecture.",
    content: `<h2>The Client-Side Fetching Era</h2><p>For years, the standard React pattern was clear: render a loading skeleton, fire off a fetch request in a useEffect, update state with the response, and handle errors. Libraries like React Query and SWR added caching, deduplication, background refetching, and optimistic updates on top of this pattern, making it remarkably robust. I built entire applications on this foundation and it worked well. But there was always an inherent tension: the browser had to download JavaScript, parse it, execute it, make a network request to the API, wait for the response, and then render the actual content. That's a lot of sequential steps before the user sees meaningful data.</p><h2>What Server Components Actually Change</h2><p>React Server Components eliminate the client-side fetch waterfall by moving data fetching to the server, where the component renders. The component can directly access the database, call internal services, or read from the filesystem without exposing API endpoints or shipping data-fetching code to the client. The result is sent to the browser as a rendered component tree, not as JavaScript that needs to execute.</p><p>The first time I converted a data-heavy page from client-side fetching to a server component, the difference was striking. The page loaded noticeably faster because there was no loading state, no skeleton, and no flash of empty content. The data was simply there when the page arrived. More importantly, the component code became dramatically simpler. No useState, no useEffect, no loading and error states, just an async function that fetches data and returns JSX.</p><h2>Rethinking Component Boundaries</h2><p>Server components forced me to reconsider where I draw component boundaries. In the client-side model, I often co-located data fetching with the component that consumed it because React Query made this easy and efficient. With server components, the boundary between server and client becomes a deliberate architectural decision. Interactive elements like buttons, form inputs, and animations need the <code>'use client'</code> directive, while data display can remain on the server.</p><p>The pattern I've settled on is keeping page-level components and data containers as server components, passing fetched data as props to client components that handle interactivity. This creates a clean separation where the server handles data and the client handles interaction, with a well-defined interface between them.</p><h2>Streaming and Suspense</h2><p>The combination of server components with streaming and Suspense boundaries unlocked a pattern I didn't know I needed. Instead of waiting for all data to be ready before sending anything to the browser, you can stream the page shell immediately and progress`,
    readTime: 11,
    tags: ["CMS", "Schema Design", "Content Modeling", "Architecture"],
    status: ArticleStatus.PUBLISHED,
  }
]