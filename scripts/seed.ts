import { PrismaClient, UserRole, ArticleStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

const experiences = [
  {
    jobTitle: "Software Engineer",
    company: "Binta Financial",
    location: "Remote",
    description: "Took ownership of key AWS cloud and delivery infrastructure, transforming deployment, testing, and release reliability with CloudFormation stacks and enabling the team to scale faster with minimal operational overhead.",
    startDate: "2024-12-01T00:00:00.000Z",
    endDate: null,
    isCurrentRole: true,
    skills: ["AWS", "NestJS", "React Native", "GH Actions", "TypeScript", "PostgreSQL", "LangChain"],
    achievements: [
      "Took ownership of key AWS cloud and delivery infra, enabling the team to scale faster with minimal operational overhead via CloudFormation stacks.",
      "Engineered and shipped a RAG platform leveraging a proprietary knowledge base to onboard new immigrants, with low-latency token streaming via SSE using LangChain, PGVector, and NestJS.",
      "Launched the company website in 3 weeks, including SEO-optimized blog, webinar hub, and careers section with a custom CMS and admin panel.",
      "Elevated user engagement by embedding a gamified learning platform into the React Native mobile app to educate users on credit fundamentals.",
    ],
  },
  {
    jobTitle: "Software Engineer",
    company: "Husridge Limited",
    location: "Remote",
    description: "Took over and delivered a talent management system that was behind schedule, end-to-end; provisioning AWS infrastructure, launching two Node-based backend services with a React client, and seamless third-party integrations that enabled reliable service delivery at scale.",
    startDate: "2025-08-01T00:00:00.000Z",
    endDate: "2025-12-31T00:00:00.000Z",
    isCurrentRole: false,
    skills: ["React", "TypeScript", "ExpressJS", "AWS", "GH Actions"],
    achievements: [
      "Took over and delivered a talent management system that was behind schedule, end-to-end.",
      "Provisioned AWS infrastructure and launched two Node-based backend services with a React client.",
      "Delivered seamless third-party integrations enabling reliable service delivery at scale.",
    ],
  },
  {
    jobTitle: "Frontend Engineer | Contract",
    company: "CompasAI",
    location: "Remote",
    description: "Delivered the flagship React client for an AI-powered, Django-based LMS enabling real-time audio transcription and interactive learning experiences at scale. Set a new UX standard by implementing a bespoke UI system from scratch with complex custom components.",
    startDate: "2025-03-01T00:00:00.000Z",
    endDate: "2025-07-31T00:00:00.000Z",
    isCurrentRole: false,
    skills: ["TypeScript", "React", "ShadCN"],
    achievements: [
      "Delivered the flagship React client for an AI-powered, Django-based LMS enabling real-time audio transcription.",
      "Set a new UX standard by implementing a bespoke UI system from scratch with dynamic module calendars, integrated AI assistants, and immersive course views.",
    ],
  },
  {
    jobTitle: "Frontend Engineer",
    company: "Lengoal",
    location: "Remote",
    description: "Played a major role in the development of a modern e-learning platform using NextJS, shipping a fast, intuitive, and highly engaging learning experience, with real-time features powered by LiveKit.",
    startDate: "2024-06-01T00:00:00.000Z",
    endDate: "2025-06-30T00:00:00.000Z",
    isCurrentRole: false,
    skills: ["NextJS", "TypeScript", "React", "LiveKit"],
    achievements: [
      "Played a major role in developing a modern e-learning platform using NextJS.",
      "Shipped real-time features powered by LiveKit for engaging learning experiences.",
    ],
  },
];

const works = [
  {
    title: "Medsync EHR",
    slug: "medsync-ehr",
    description: "A patient-centred health records experience built for Nigerian healthcare: one place for hospitals, doctors, lab staff, and patients to share context rather than lose it between visits and facilities.",
    content: `<h2>Why this existed is easy to state and hard to fix in real life.</h2>
<p>In my region, many health providers still maintain records that live on paper or in isolated EMR systems that do not talk to each other, so when someone moves hospitals or arrives in an emergency at an unfamiliar health facility, the story of their care is incomplete. MedSync was imagined as a calmer, connected layer: one trusted view of the patient across all health facilities, with room for the messy human parts like appointments, labs, conversations, and (carefully bounded) help from an AI assistant.</p>
<p>The build sits alongside academic work on what a centralised EHR would need to mean in Nigeria. This not only includes software, but adoption, policy, and day-to-day operations. The prototype is the attempt to ground that research in something you can click through.</p>
<h2>What it actually delivers</h2>
<p>You can see the shape of the product in this walkthrough; different roles see only what they need: hospital setup and oversight, clinical depth for doctors, lab workflows, and a patient-facing slice for longitudinal records and messaging. Chat is there because care is coordinated, not only documented. The assistant is there as a support act for doctors, as one of the major challenges for them is data entry. The assistant context is anchored on unified patient records rather than generic advice.</p>
<h2>Next steps</h2>
<p>A system like this only matters if it can stay online, audited, and aligned with regulation and clinical safety, especially anywhere AI touches decisions. Long term, the boring wins would be FHIR standards for interoperability, clear consent, and more role-centric workflows. These would be the next lift if or when I move it beyond prototype.</p>
<p>Credit to Emmanuel Tanimowo for documentation and engineering support on the journey.</p>`,
    image: null,
    videoUrl: null,
    tools: ["Python", "TypeScript", "Django", "React", "Gemini"],
    githubLink: null,
    liveUrl: null,
    featured: true,
    category: "Healthcare",
  },
  {
    title: "Topmart Store",
    slug: "topmart-store",
    description: "Product listing storefront with Paystack checkout, backed by a separate Next.js admin app.",
    content: `<h2>Topmart</h2>
<p>Topmart is an everyday e-commerce product listing site: a public storefront and a separate administrator app. The storefront is Next.js with TypeScript on the App Router. A big reason for that choice was SEO and performance; server-rendered product and billboard pages, sensible metadata, and predictable data loading from the API the admin exposes.</p>
<p>The admin app lives in another repository and behaves like a headless CMS plus API: the storefront consumes catalogue data from it, similar in spirit to pairing a shop front with Strapi.</p>
<h2>Process</h2>
<p>SEO work is mostly Next.js metadata and rendering choices. As is the norm, rendering is a mix of what fits each route: static generation where the catalogue can be resolved up front, and dynamic server rendering where IDs need a request-time fetch, so crawlers and first visits still get full HTML for product and billboard pages. A route-level <code>sitemap.ts</code> pregenerates <code>/sitemap.xml</code> from the live product and billboard IDs the API returns, alongside fixed URLs like home and cart.</p>
<p>Visitors browse and filter by category, size, and colour, open product detail routes, and pay through Paystack. There is no customer auth on the shop side.</p>
<h2>Next Steps</h2>
<p>The repos are already open source, and I am happy to take contributions, issues, and PRs are welcome.</p>
<p>Whenever I'm less stressed with work, I plan to build richer analytics so store owners can see more than surface-level traffic. I also want deeper page customisation, closer to what Shopify and similar platforms make easy out of the box; the trade-off I care about is that Topmart stays open source, so teams can fork and adapt without a closed ecosystem.</p>
<p>Including a multivendor storefront is the major milestone on the roadmap. Single-store storefronts would remain a first-class path for anyone who only needs one shop.</p>`,
    image: null,
    videoUrl: null,
    tools: ["Next.js", "TypeScript", "shadcn/ui", "Paystack", "Prisma"],
    githubLink: "https://github.com/Topman-14/topmart-client",
    liveUrl: null,
    featured: true,
    category: "E-commerce",
  },
];

const articles = [
  {
    title: "Building Agentic UI that adapts to your user's needs — AG-UI",
    slug: "building-agentic-ui-ag-ui",
    excerpt: "AG-UI in plain language: capabilities vs static UI, tradeoffs, and where to start.",
    content: `<p>If you've used MCPs and CLIs, or you've read about the A2A protocol, you'll eventually bump into AG-UI. I had to read their repo readme and docs quite a few times before it stuck, but the concept is nice. If you've built chat interfaces, especially agentic ones, you've definitely had to build around this already, whether or not you had a name for it.</p>
<p>Traditionally, we build static UIs. We predict every possible user path and hard-code a button or some other component for it. If a user wants to do something we didn't build for, or wants to tweak their UI in ways we didn't plan for that would actually help them, they're stuck.</p>
<p>AG-UI flips this. Instead of a library of fixed pages, you build a library of capabilities. When a user expresses an intent, an agent figures out which capability is needed and "renders" the specific UI components for that moment.</p>
<p>Notice how I said you might have done something like this before? You've probably tweaked the UI based on the response from an agent more times than you can count. I know I did a lot at CompasAI.</p>
<h2>Brief History</h2>
<p>In early 2024, "AI in the UI" mostly meant a small chat bubble in the corner of a screen. It was disconnected from the rest of the application.</p>
<p>By late 2025, the chat box was a bottleneck. Users wanted to get things done rather than just chat all the time. We started seeing generative UI, but it was fragmented. Every team was building its own custom "streaming component" logic.</p>
<p>The AG-UI protocol came out of that mess. The docs line it up next to MCP: MCP standardized how agents talk to data; AG-UI is the push to standardize how agents talk to humans through interfaces (MCP, A2A, and AG-UI).</p>
<p>If a traditional UI is a fast food menu, AG-UI is closer to a private chef.</p>
<p>You say: "I'm hosting a Chinese dinner for four." The chef won't hand you the same laminated list every time like a waiter. They lay out the ingredients, tools, and plates for that meal.</p>
<p>In AG-UI, the "ingredients" are your React / Shadcn components (or whatever you register), and the "chef" is the AI agent. The UI is generated just-in-time from what the agent is allowed to ask for.</p>
<h2>Core pieces</h2>
<ul>
  <li><strong>Intent parser:</strong> figures out what the user is trying to do (voice, text, behavior).</li>
  <li><strong>Orchestrator:</strong> the brain (LLM) that picks which capability fires.</li>
  <li><strong>The registry:</strong> your catalog of headless UI pieces the agent can actually request.</li>
  <li><strong>The transport:</strong> streaming, usually SSE or WebSockets, carrying UI instructions to the client.</li>
</ul>
<p>Long sentence out of the way: you still own the design system.</p>
<h2>Ecosystem</h2>
<p>The <code>ag-ui-protocol/ag-ui</code> repo is the obvious home base. It's a wire protocol that's being standardised.</p>
<p>Quick start if you're ready to touch code: Build applications. If you want demos with previews, there's the AG-UI Dojo.</p>
<h2>Tradeoffs</h2>
<p>Switching from traditional, deterministic UIs to AGUI is a significant architectural decision that unlocks a lot of flexibility. It, however, introduces new challenges to address.</p>
<p>In a traditional UI, you know exactly what a user sees. In AGUI, the agent can literally "hallucinate" the interface, where the agent might request a component in a sequence that makes no sense to a human user (e.g., showing a "Confirm Purchase" button before showing the "Price Breakdown").</p>
<p>People rely on habits (sidebar on the left, checkout steps in order) to move without thinking. When the shell shifts every turn, those mental models crack. The user is not lost because they're stupid; the app UI just keeps moving.</p>
<p>Agents often stream tool outputs straight into generative components, so backend over-fetching is a real risk. You have to be strict about what leaves the server: PII and internal IDs should not hit the AG-UI layer unfiltered.</p>
<p>The layout can change run to run. Your tests can't live on one happy-path snapshot anymore. Someone on the team has to own state machines, interrupts, and what happens when the stream stops mid-card. Nondeterministic UI, deterministic QA: same tension as always, just louder.</p>
<p>Guardrails mitigate some of these issues, like what the agent can request, enforce order for money flows, human-in-the-loop before irreversible actions, and validate payloads before rendering.</p>
<h2>Conclusion</h2>
<p>I might have oversold the chef metaphor btw. AG-UI probably increases the number of ways you can cook beans. Still, if you're tired of bespoke streaming message types and you're building a new agentic application with standardized tooling, AG-UI is worth the random readme pass I did at 1 am last Sunday.</p>`,
    readTime: 5,
    tags: ["AG-UI", "MCP", "generative UI", "CopilotKit", "AI"],
    status: ArticleStatus.PUBLISHED,
    publishedAt: new Date("2025-05-15T00:00:00.000Z"),
  },
  {
    title: "Remote PostgreSQL DB on Ubuntu (EC2) not connecting",
    slug: "remote-postgresql-db-on-ubuntu-ec2-not-connecting",
    excerpt: "Fix PostgreSQL on Ubuntu when remote connections fail: open the port in AWS Security Group and UFW, set listen_addresses and pg_hba.conf, then verify with nc.",
    content: `<p>You've just installed PostgreSQL on an EC2 instance. You open the port in the security group. You connect from your local machine and get... nothing. A timeout. Or "connection refused." Or your app on the server connects fine but everything remote refuses. It probably isn't a password problem; you're smarter than that. Not a port problem. Definitely not a Postgres bug.</p>
<p>It's a layering issue. Five independent systems all need to say yes before a remote connection reaches your database. Miss any one of them like you've done and you'll be stuck guessing, convinced the gods are against you when the server was never listening where you thought it was.</p>
<p>A few years ago I had this issue and I literally couldn't crack this for quite sometime until some godsend StackOverflow answer. The last time someone asked me why their Postgres wasn't reachable, I had an answer. This is that answer.</p>
<p>These are the five layers, in the order you'll hit them when debugging:</p>
<ol>
  <li>AWS Security Group: cloud firewall, inbound rules</li>
  <li>Ubuntu UFW: OS firewall on the box itself</li>
  <li>postgresql.conf: where Postgres listens</li>
  <li>pg_hba.conf: who's allowed to connect</li>
  <li>App connection string: what your code actually reads</li>
</ol>
<p>The Security Group step is AWS-specific. Everything else (UFW, the Postgres config files, the SQL grants) applies the same way on DigitalOcean, Hetzner, a homelab, or any VPS.</p>
<p>Ofc I know database services like RDS exist. Managed backups, automatic patching, Multi-AZ, the whole thing. For real production work I'd weigh that seriously. But sometimes you just like pain and stress or your use case requires a box you can SSH into. Or you just want to understand what's happening underneath. This is for those times.</p>
<h2>1. Network layer (AWS Security Group)</h2>
<p>Postgres runs on TCP port 5432 by default. Your laptop is not talking to Postgres yet. It's talking to the Security Group attached to the EC2 instance, which decides whether the packet even reaches the box.</p>
<p>In the AWS console, find the Security Group for your instance and add an inbound rule:</p>
<table>
  <thead>
    <tr><th>Field</th><th>Value</th></tr>
  </thead>
  <tbody>
    <tr><td>Type</td><td>PostgreSQL (or Custom TCP)</td></tr>
    <tr><td>Protocol</td><td>TCP</td></tr>
    <tr><td>Port</td><td>5432</td></tr>
    <tr><td>Source</td><td>Your public IP with /32 for everyday work. 0.0.0.0/0 only if you're explicitly testing open access, and don't leave it that way.</td></tr>
  </tbody>
</table>
<p>On other clouds this is "firewall rules" or "network ACLs."</p>
<h2>2. OS layer (Ubuntu UFW)</h2>
<p>Ubuntu ships with UFW enabled. A wide-open Security Group plus a closed UFW still means the packet dies on arrival. Two firewalls running in sequence is normal, and both of them need to agree.</p>
<pre><code>sudo ufw allow 5432/tcp
sudo ufw status</code></pre>
<p>If your instance uses iptables or firewalld instead, open 5432/tcp there. The tool doesn't matter; the port does.</p>
<h2>3. Database config layer</h2>
<p>Check your Postgres version first — the version number maps directly to the config directory:</p>
<pre><code>pg_lscluster</code></pre>
<p>The output looks like <code>16 main 5432 online</code>. That first number is your version. Config lives at <code>/etc/postgresql/&lt;version&gt;/main/</code>. Two files are responsible for "why won't anything outside localhost connect?"</p>
<h3>postgresql.conf</h3>
<p>Find <code>listen_addresses</code> and set it to:</p>
<pre><code>listen_addresses = '*'</code></pre>
<p>By default this is <code>localhost</code>. That means Postgres is only listening on the loopback interface. <code>psql</code> from inside the server works fine, but nothing from outside ever reaches it. The <code>*</code> tells it to listen on every interface the OS exposes.</p>
<h3>pg_hba.conf</h3>
<p>This file controls client authentication: who is allowed to connect, from where, and how. Add a line at the bottom (rules are evaluated in order, top to bottom):</p>
<pre><code>host    all    all    0.0.0.0/0    md5</code></pre>
<p>Depending on your Postgres version and the <code>password_encryption</code> setting, you may need <code>scram-sha-256</code> instead of <code>md5</code>. Use whatever your server expects. Once you're done experimenting, tighten <code>0.0.0.0/0</code> down to your actual IP or office CIDR. Wide-open host-based auth is fine for learning; it's not fine past that.</p>
<h3>One-liner to update both files and restart</h3>
<p>If you want to skip the manual edits and do everything at once:</p>
<pre><code>PG_VER=$(pg_lscluster | awk '{print $1}') && \\
  sudo sed -i "s/^#*listen_addresses = .*/listen_addresses = '*'/" /etc/postgresql/$PG_VER/main/postgresql.conf && \\
  echo "host all all 0.0.0.0/0 md5" | sudo tee -a /etc/postgresql/$PG_VER/main/pg_hba.conf && \\
  sudo systemctl restart postgresql</code></pre>
<p>This sets <code>listen_addresses</code>, appends the <code>pg_hba.conf</code> rule, and restarts Postgres in one shot. If you need <code>scram-sha-256</code> instead of <code>md5</code>, swap it before running.</p>
<p>Or restart manually after editing both files yourself:</p>
<pre><code>sudo systemctl restart postgresql</code></pre>
<p>These two files are not AWS-specific at all. Every manual Postgres install on Linux hits this wall. Every time.</p>
<h2>4. Permissions layer (SQL grants)</h2>
<p>Network works. Auth works. You're still seeing "permission denied for schema public."</p>
<p>This one is the most annoying to debug because the connection actually succeeds, the auth succeeds, and then Postgres denies you anyway. It started happening more with Postgres 15, which tightened the default permissions on the public schema. Networking and authentication are completely separate from what a role is allowed to do once it gets in.</p>
<p>Connect as the superuser:</p>
<pre><code>sudo -u postgres psql -d postgres</code></pre>
<p>Then run your grants, replacing <code>your_user</code> and <code>your_db</code> with what your app actually uses:</p>
<pre><code>GRANT ALL ON SCHEMA public TO your_user;
GRANT ALL PRIVILEGES ON DATABASE your_db TO your_user;
ALTER SCHEMA public OWNER TO your_user;</code></pre>
<p>One trap I hit personally: running these grants on the <code>postgres</code> default database while my app was connecting to <code>portfolio_db</code>. Guess what? The grants don't carry over. Run them on the database your app actually uses.</p>
<h2>5. Application layer (.env)</h2>
<p>Point your client at the public IP the Security Group opened, with the user and database you configured:</p>
<pre><code>DATABASE_URL="postgresql://your_user:PASSWORD@EC2_PUBLIC_IP:5432/your_db?schema=public"</code></pre>
<p>If your app connects to a different database than the one you granted on, swap it here.</p>
<h2>Verify the network pipe before anything else</h2>
<p>Before you touch a single Postgres config file, run this from your local machine:</p>
<pre><code>nc -zv EC2_PUBLIC_IP 5432</code></pre>
<p>If that succeeds, the network path is open and the problem is in layers 3 through 5. If it times out or refuses, the problem is in layers 1 or 2. Fix Security Group and UFW first. Do not touch SQL until <code>nc</code> passes.</p>
<p>I wasted 30 minutes once going deep into <code>pg_hba.conf</code> only to find the Security Group rule had the wrong IP. <code>nc</code> would have told me in 5 seconds.</p>
<p>Debugging order when something's broken: Security Group, UFW, <code>listen_addresses</code>, <code>pg_hba.conf</code>, user grants, connection string. Work down the list in order.</p>`,
    readTime: 7,
    tags: ["cloud", "aws", "PostgreSQL", "Ubuntu", "EC2", "database"],
    status: ArticleStatus.PUBLISHED,
    publishedAt: new Date("2025-04-10T00:00:00.000Z"),
  },
];

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data
    await prisma.comment.deleteMany();
    await prisma.article.deleteMany();
    await prisma.work.deleteMany();
    await prisma.experience.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    console.log('🗑️  Cleared existing data');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const user = await prisma.user.create({
      data: {
        email: 'topeakinkuade78@gmail.com',
        name: 'Tope Akinkuade',
        password: hashedPassword,
        role: UserRole.ADMIN,
        bio: 'Results-driven Product Engineer with years of hands-on experience building and scaling web applications across fintech and logistics B2B platforms',
        twitterUrl: 'https://twitter.com/therealtope_',
        linkedinUrl: 'https://www.linkedin.com/in/tope-akinkuade/',
        githubUrl: 'https://github.com/Topman-14',
        websiteUrl: 'https://findtope.dev/',
      },
    });

    console.log('✅ User created:', user.email);

    for (const exp of experiences) {
      await prisma.experience.create({
        data: {
          jobTitle: exp.jobTitle,
          company: exp.company,
          location: exp.location,
          description: exp.description,
          startDate: new Date(exp.startDate),
          endDate: exp.endDate ? new Date(exp.endDate) : null,
          isCurrentRole: exp.isCurrentRole,
          skills: exp.skills,
          achievements: exp.achievements,
          userId: user.id,
        },
      });
    }

    console.log('✅ Experiences created:', experiences.length);

    for (const work of works) {
      await prisma.work.create({
        data: {
          title: work.title,
          slug: work.slug,
          description: work.description,
          content: work.content,
          image: work.image,
          videoUrl: work.videoUrl,
          tools: work.tools,
          githubLink: work.githubLink,
          liveUrl: work.liveUrl,
          featured: work.featured,
          category: work.category,
          userId: user.id,
        },
      });
    }

    console.log('✅ Works created:', works.length);

    for (const article of articles) {
      await prisma.article.create({
        data: {
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          readTime: article.readTime,
          tags: article.tags,
          status: article.status,
          publishedAt: article.publishedAt,
          userId: user.id,
        },
      });
    }

    console.log('✅ Articles created:', articles.length);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log('- Users: 1');
    console.log('- Experiences:', experiences.length);
    console.log('- Works:', works.length);
    console.log('- Articles:', articles.length);
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

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
