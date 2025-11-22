export const BASE_URL = "https://tops.dev";

export const routes = {
  root: "/",
  about: "/about",
  work: "/work",
  blog: "/blog",
  contact: "/contact",
  admin: "/admin",
  adminBlog: "/admin/articles",
  adminWork: "/admin/work",
  adminExperience: "/admin/experience",
  adminCategories: "/admin/categories",
  signIn: "/auth/sign-in",
}

export const AdminNavRoutes = [
  {
    href: `${routes.admin}`,
    label: 'Overview',
  },
  {
    href: `${routes.adminBlog}`,
    label: 'Articles',
  },
  {
    href: `${routes.adminWork}`,
    label: 'Work',
  },
  {
    href: `${routes.adminExperience}`,
    label: 'Experience',
  },
  {
    href: `${routes.adminCategories}`,
    label: 'Categories',
  },
]

export const navItems = [
  { name: "Home", href: "/" },
  // { name: "About", href: "/about" },
  { name: "Work", href: "/work" },
  // { name: "Blog", href: "/blog" },
  // { name: "Contact", href: "/contact" },
];

export const socials = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/tope-akinkuade/"
  },
  {
    name: "Twitter",
    href: "https://www.twitter.com/therealtope_"
  },
  {
    name: "GitHub",
    href: "https://www.github.com/Topman-14"
  },
  {
    name: "Email",
    href: "mailto:topeakinkuade78@gmail.com"
  }
];

export const MAIN_EMAIL = 'topeakinkuade78@gmail.com';

export const REPO_URL = 'https://github.com/Topman-14/portfolio-v2';