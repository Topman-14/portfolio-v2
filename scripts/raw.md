table 001:
Experience:
1. Dec 2024 — Apr 2026

Software Engineer
Binta Financial

Remote

- Took ownership of key AWS cloud and delivery infra, transforming deployment, testing, and release reliability with CloudFormation stacks and enabling the team to scale faster with minimal operational overhead.

- Engineered and shipped a RAG platform leveraging a proprietary company knowledge base to rapidly onboard new and aspiring immigrants, delivering accurate guidance at scale using LangChain, PGVector, and NestJS, with low-latency token streaming via SSE.

- Launched the company’s website in 3 weeks, including an SEO-optimized blog, webinar hub, and careers section, supported by a custom CMS and admin panel built with TypeScript, Node, React, and Strapi.

- Elevated user engagement and financial literacy by embedding a gamified learning platform into the React Native mobile application, educating users on credit fundamentals through interactive, progress-driven experiences that would increased retention and sustained usage.


AWS
NestJS
React Native
GH Actions
Typescript
PostgreSQL
LangChain



2. Aug 2025 — Dec 2025

Software Engineer
Husridge Limited

Remote

Took over and delivered a talent management system that was behind schedule, end-to-end; provisioning AWS infrastructure, launching two Node-based backend services with a React client, and seamless third-party integrations that enabled reliable service delivery at scale.

React
TypeScript
ExpressJS
AWS
GH Actions
Mar 2025 — Jul 2025

Frontend Engineer | Contract
CompasAI

Remote

- Delivered the flagship React client for an AI-powered, Django-based LMS enabling real-time audio transcription and interactive learning experiences at scale.

- Set a new UX standard for the platform by implementing a bespoke UI system from scratch, featuring complex, fully custom components such as dynamic module calendars, integrated AI assistants, and immersive course views.

TypeScript
React
ShadCN


3. Jun 2024 — Jun 2025

 Frontend Engineer
Lengoal

Remote

- Played a major role in the development of a modern e-learning platform using NextJS, shipping a fast, intuitive, and highly engaging learning experience, with real-time features powered by LiveKit.


NextJS
Typescript
React
Livekit



4. Mar 2025 — Jul 2025

Frontend Engineer | Contract
CompasAI

Remote

- Delivered the flagship React client for an AI-powered, Django-based LMS enabling real-time audio transcription and interactive learning experiences at scale.

- Set a new UX standard for the platform by implementing a bespoke UI system from scratch, featuring complex, fully custom components such as dynamic module calendars, integrated AI assistants, and immersive course views.

TypeScript
React
ShadCN


5. Jun 2024 — Jun 2025

Frontend Engineer
Lengoal

Remote

- Played a major role in the development of a modern e-learning platform using NextJS, shipping a fast, intuitive, and highly engaging learning experience, with real-time features powered by LiveKit.


NextJS
Typescript
React
Livekit


table 002
Work/Projects


1. title: Medsync EHR
Healthcare
Featured
A patient-centred health records experience built for Nigerian healthcare: one place for hospitals, doctors, lab staff, and patients to share context rather than lose it between visits and facilities.

Python
Typescript
Django
React
Gemini
View code
On this page

What it actually delivers
Next steps
Why this existed is easy to state and hard to fix in real life.

In my region, many health providers still maintain records that live on paper or in isolated EMR systems that do not talk to each other, so when someone moves hospitals or arrives in an emergency at an unfamiliar health facility, the story of their care is incomplete. MedSync was imagined as a calmer, connected layer: one trusted view of the patient across all health facilities, with room for the messy human parts like appointments, labs, conversations, and (carefully bounded) help from an AI assistant.

The build sits alongside academic work on what a centralised EHR would need to mean in Nigeria. This not only includes software, but adoption, policy, and day-to-day operations. The prototype is the attempt to ground that research in something you can click through.

What it actually delivers
You can see the shape of the product in this walkthrough; different roles see only what they need: hospital setup and oversight, clinical depth for doctors, lab workflows, and a patient-facing slice for longitudinal records and messaging. Chat is there because care is coordinated, not only documented. The assistant is there as a support act for doctors, as one of the major challenges for them is data entry. The assistant context is anchored on unified patient records rather than generic advice.

Next steps
A system like this only matters if it can stay online, audited, and aligned with regulation and clinical safety, especially anywhere AI touches decisions. Long term, the boring wins would be FHIR standards for interoperability, clear consent, and more role-centric workflows. These would be the next lift if or when I move it beyond prototype.

Credit to Emmanuel Tanimowo for documentation and engineering support on the journey.


2. title: Topmart Store- Ecommerce App
 E-commerce
Featured
Product listing storefront with Paystack checkout, backed by a separate Next.js admin app

Next.js
TypeScript
shadcn/ui
Paystack
Prisma
View live
View code
On this page

Topmart
Process
Next Steps
Topmart
Topmart is an everyday e-commerce product listing site: a public storefront and a separate administrator app. The storefront is Next.js with TypeScript on the App Router. A big reason for that choice was SEO and performance; server-rendered product and billboard pages, sensible metadata, and predictable data loading from the API the admin exposes.

The admin app lives in another repository and behaves like a headless CMS plus API: the storefront consumes catalogue data from it, similar in spirit to pairing a shop front with Strapi.

Process
SEO work is mostly Next.js metadata and rendering choices. As is the norm, rendering is a mix of what fits each route: static generation where the catalogue can be resolved up front, and dynamic server rendering where IDs need a request-time fetch, so crawlers and first visits still get full HTML for product and billboard pages. A route-level sitemap.ts pregenerates /sitemap.xml from the live product and billboard IDs the API returns, alongside fixed URLs like home and cart.

Visitors browse and filter by category, size, and colour, open product detail routes, and pay through Paystack. There is no customer auth on the shop side.

Next Steps
The repos are already open source, and I am happy to take contributions, issues, and PRs are welcome.

Whenever I'm less stressed with work, I plan to build richer analytics so store owners can see more than surface-level traffic. I also want deeper page customisation, closer to what Shopify and similar platforms make easy out of the box; the trade-off I care about is that Topmart stays open source, so teams can fork and adapt without a closed ecosystem.

Including a multivendor storefront is the major milestone on the roadmap. Single-store storefronts would remain a first-class path for anyone who only needs one shop.

table 003
Articles

1. Building Agentic UI that adapts to your user's needs - AG-UI
AG-UI in plain language: capabilities vs static UI, tradeoffs, and where to start (repo, quickstart)

AG-UI
MCP
generative UI
CopilotKit
AI

If you've used MCPs and CLIs, or you've read about the A2A protocol, you'll eventually bump into AG-UI. I had to read their repo readme and docs quite a few times before it stuck, but the concept is nice. If you've built chat interfaces, especially agentic ones, you've definitely had to build around this already, whether or not you had a name for it.

Traditionally, we build static UIs. We predict every possible user path and hard-code a button or some other component for it. If a user wants to do something we didn't build for, or wants to tweak their UI in ways we didn't plan for that would actually help them, they're stuck.

AG-UI flips this. Instead of a library of fixed pages, you build a library of capabilities. When a user expresses an intent, an agent figures out which capability is needed and "renders" the specific UI components for that moment.

Notice how I said you might have done something like this before? You've probably tweaked the UI based on the response from an agent more times than you can count. I know I did a lot at CompasAI.

Brief History
In early 2024, "AI in the UI" mostly meant a small chat bubble in the corner of a screen. It was disconnected from the rest of the application.

By late 2025, the chat box was a bottleneck. Users wanted to get things done rather than just chat all the time. We started seeing generative UI, but it was fragmented. Every team was building its own custom "streaming component" logic.

The AG-UI protocol came out of that mess. The docs line it up next to MCP: MCP standardized how agents talk to data; AG-UI is the push to standardize how agents talk to humans through interfaces (MCP, A2A, and AG-UI).

If a traditional UI is a fast food menu, AG-UI is closer to a private chef.

You say: "I'm hosting a Chinese dinner for four." The chef won’t hand you the same laminated list every time like a waiter. They lay out the ingredients, tools, and plates for that meal.

In AG-UI, the "ingredients" are your React / Shadcn components (or whatever you register), and the "chef" is the AI agent. The UI is generated just-in-time from what the agent is allowed to ask for.

Core pieces:

Intent parser: figures out what the user is trying to do (voice, text, behavior).

Orchestrator: the brain (LLM) that picks which capability fires.

The registry: your catalog of headless UI pieces the agent can actually request.

The transport: streaming, usually SSE or WebSockets, carrying UI instructions to the client.

Long sentence out of the way: you still own the design system.

Ecosystem
The ag-ui-protocol/ag-ui repo is the obvious home base. It's a wire protocol that's being standardised.

Quick start if you're ready to touch code: Build applications. If you want demos with previews, there's the AG-UI Dojo.

Tradeoffs
Switching from traditional, deterministic UIs to AGUI is a significant architectural decision that it unlocks a lot of flexibility. It, however, introduces new challenges to address

In a traditional UI, you know exactly what a user sees. In AGUI, the agent can literally "hallucinate" the interface, where the agent might request a component in a sequence that makes no sense to a human user (e.g., showing a "Confirm Purchase" button before showing the "Price Breakdown").

People rely on habits (sidebar on the left, checkout steps in order) to move without thinking. When the shell shifts every turn, those mental models crack. The user is not lost because they're stupid; the app UI just keeps moving.

Agents often stream tool outputs straight into generative components, so backend over-fetching is a real risk. You have to be strict about what leaves the server: PII and internal IDs should not hit the AG-UI layer unfiltered.

The layout can change run to run. Your tests can't live on one happy-path snapshot anymore. Someone on the team has to own state machines, interrupts, and what happens when the stream stops mid-card. Nondeterministic UI, deterministic QA: same tension as always, just louder.

Guardrails mitigate some of these issues, like what the agent can request, enforce order for money flows, human-in-the-loop before irreversible actions, and validate payloads before rendering.

Conclusion
I might have oversold the chef metaphor btw. AG-UI probably increases the number of ways you can cook beans. Still, if you're tired of bespoke streaming message types and you're building a new agentic application with standardized tooling, AG-UI is worth the random readme pass I did at 1 am last Sunday.


2. Remote PostgreSQL DB on Ubuntu (EC2) not connecting
Fix PostgreSQL on Ubuntu when remote connections fail: open the port in AWS Security Group and UFW, set listen_addresses and pg_hba.conf, then verify with nc.

cloud
aws
PostgreSQL
Ubuntu
EC2
database

You've just installed PostgreSQL on an EC2 instance. You open the port in the security group. You connect from your local machine and get... nothing. A timeout. Or "connection refused." Or your app on the server connects fine but everything remote refuses. It probably isn't a password problem; you're smarter than that. Not a port problem. Definitely not a Postgres bug.

It's a layering issue. Five independent systems all need to say yes before a remote connection reaches your database. Miss any one of them like you've done and you'll be stuck guessing, convinced the gods are against you when the server was never listening where you thought it was.

A few years ago I had this issue and I literally couldn't crack this for quite sometime until some godsend StackOverflow answer. The last time someone asked me why their Postgres wasn't reachable, I had an answer. This is that answer.

These are the five layers, in the order you'll hit them when debugging:

AWS Security Group: cloud firewall, inbound rules

Ubuntu UFW: OS firewall on the box itself

postgresql.conf: where Postgres listens

pg_hba.conf: who's allowed to connect

App connection string: what your code actually readsz

The Security Group step is AWS-specific. Everything else (UFW, the Postgres config files, the SQL grants) applies the same way on DigitalOcean, Hetzner, a homelab, or any VPS.

Ofc I know database services like RDS exist. Managed backups, automatic patching, Multi-AZ, the whole thing. For real production work I'd weigh that seriously. But sometimes you just like pain and stress or your use case requires a box you can SSH into. Or you just want to understand what's happening underneath. This is for those times.

1. Network layer (AWS Security Group)
Postgres runs on TCP port 5432 by default. Your laptop is not talking to Postgres yet. It's talking to the Security Group attached to the EC2 instance, which decides whether the packet even reaches the box.

In the AWS console, find the Security Group for your instance and add an inbound rule:

Field

Value

Type

PostgreSQL (or Custom TCP)

Protocol

TCP

Port

5432

Source

Your public IP with /32 for everyday work. 0.0.0.0/0 only if you're explicitly testing open access, and don't leave it that way.

On other clouds this is "firewall rules" or "network ACLs."

2. OS layer (Ubuntu UFW)
Ubuntu ships with UFW enabled. A wide-open Security Group plus a closed UFW still means the packet dies on arrival. Two firewalls running in sequence is normal, and both of them need to agree.

sudo ufw allow 5432/tcp
sudo ufw status
If your instance uses iptables or firewalld instead, open 5432/tcp there. The tool doesn't matter; the port does.

3. Database config layer
Check your Postgres version first — the version number maps directly to the config directory:

pg_lscluster
The output looks like 16 main 5432 online. That first number is your version. Config lives at /etc/postgresql/<version>/main/. Two files are responsible for "why won't anything outside localhost connect?"

postgresql.conf
Find listen_addresses and set it to:

listen_addresses = '*'
By default this is localhost. That means Postgres is only listening on the loopback interface. psql from inside the server works fine, but nothing from outside ever reaches it. The * tells it to listen on every interface the OS exposes.

pg_hba.conf
This file controls client authentication: who is allowed to connect, from where, and how. Add a line at the bottom (rules are evaluated in order, top to bottom):

host    all    all    0.0.0.0/0    md5
Depending on your Postgres version and the password_encryption setting, you may need scram-sha-256 instead of md5. Use whatever your server expects. Once you're done experimenting, tighten 0.0.0.0/0 down to your actual IP or office CIDR. Wide-open host-based auth is fine for learning; it's not fine past that.

One-liner to update both files and restart
If you want to skip the manual edits and do everything at once:

PG_VER=$(pg_lscluster | awk '{print $1}') && \
  sudo sed -i "s/^#*listen_addresses = .*/listen_addresses = '*'/" /etc/postgresql/$PG_VER/main/postgresql.conf && \
  echo "host all all 0.0.0.0/0 md5" | sudo tee -a /etc/postgresql/$PG_VER/main/pg_hba.conf && \
  sudo systemctl restart postgresql
This sets listen_addresses, appends the pg_hba.conf rule, and restarts Postgres in one shot. If you need scram-sha-256 instead of md5, swap it before running.

Or restart manually after editing both files yourself:

sudo systemctl restart postgresql
These two files are not AWS-specific at all. Every manual Postgres install on Linux hits this wall. Every time.

4. Permissions layer (SQL grants)
Network works. Auth works. You're still seeing "permission denied for schema public."

This one is the most annoying to debug because the connection actually succeeds, the auth succeeds, and then Postgres denies you anyway. It started happening more with Postgres 15, which tightened the default permissions on the public schema. Networking and authentication are completely separate from what a role is allowed to do once it gets in.

Connect as the superuser:

sudo -u postgres psql -d postgres
Then run your grants, replacing your_user and your_db with what your app actually uses:

GRANT ALL ON SCHEMA public TO your_user;
GRANT ALL PRIVILEGES ON DATABASE your_db TO your_user;
ALTER SCHEMA public OWNER TO your_user;
One trap I hit personally: running these grants on the postgres default database while my app was connecting to portfolio_db. Guess what? The grants don't carry over. Run them on the database your app actually uses.

5. Application layer (.env)
Point your client at the public IP the Security Group opened, with the user and database you configured:

DATABASE_URL="postgresql://your_user:PASSWORD@EC2_PUBLIC_IP:5432/your_db?schema=public"
If your app connects to a different database than the one you granted on, swap it here.

Verify the network pipe before anything else
Before you touch a single Postgres config file, run this from your local machine:

nc -zv EC2_PUBLIC_IP 5432
If that succeeds, the network path is open and the problem is in layers 3 through 5. If it times out or refuses, the problem is in layers 1 or 2. Fix Security Group and UFW first. Do not touch SQL until nc passes.

I wasted 30 minutes once going deep into pg_hba.conf only to find the Security Group rule had the wrong IP. nc would have told me in 5 seconds.

Debugging order when something's broken: Security Group, UFW, listen_addresses, pg_hba.conf, user grants, connection string. Work down the list in order.


ABOUT:
Tope Akinkuade
Results-driven Product Engineer with years of hands-on experience building and scaling web applications across fintech and logistics B2B platforms
https://twitter.com/therealtope_
https://www.linkedin.com/in/tope-akinkuade/
https://github.com/Topman-14
https://findtope.dev/
