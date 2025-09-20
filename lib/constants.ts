export const BASE_URL = "https://topeakinkuade.com";

export const routes = {
    root: "/",
    about: "/about",
    work: "/work",
    blog: "/blog",
    contact: "/contact",
    admin: "/admin",
    adminBlog: "/admin/articles",
    adminWork: "/admin/work",
    adminExperience: "/admin/exp",
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
  ]