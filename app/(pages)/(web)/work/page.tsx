export default function Work() {
  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution built with Next.js, featuring user authentication, payment processing, and admin dashboard.",
      technologies: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
      status: "Completed",
      image: "/img/png/logo-bg.png"
    },
    {
      id: 2,
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates, team collaboration features, and advanced filtering.",
      technologies: ["React", "Node.js", "Socket.io", "MongoDB"],
      status: "In Progress",
      image: "/img/png/logo-bg.png"
    },
    {
      id: 3,
      title: "Portfolio Website",
      description: "A modern, responsive portfolio website showcasing projects and skills with smooth animations and dark mode support.",
      technologies: ["Next.js", "Tailwind CSS", "Framer Motion"],
      status: "Completed",
      image: "/img/png/logo-bg.png"
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">My Work</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A showcase of projects I&apos;ve built with passion and dedication
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Project Image */}
              <div className="h-48 bg-accent flex items-center justify-center">
                <span className="text-muted-foreground">Project Image</span>
              </div>

              {/* Project Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-card-foreground">
                    {project.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === "Completed" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  }`}>
                    {project.status}
                  </span>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                    View Project
                  </button>
                  <button className="px-4 py-2 border border-border text-foreground rounded-md text-sm font-medium hover:bg-accent transition-colors">
                    Code
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center pt-8 border-t border-border">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Interested in Working Together?
          </h2>
          <p className="text-muted-foreground mb-6">
            I&apos;m always open to discussing new opportunities and exciting projects.
          </p>
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors">
            Get In Touch
          </button>
        </div>
      </div>
    </div>
  );
}
