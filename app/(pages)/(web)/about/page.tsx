export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">About Me</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Passionate developer crafting digital experiences with modern technologies
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Hello, I&apos;m a Developer
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                I&apos;m a passionate full-stack developer with expertise in modern web technologies. 
                I love creating beautiful, functional, and user-friendly applications that solve 
                real-world problems.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                What I Do
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Full-stack web development</li>
                <li>• Modern JavaScript frameworks (React, Next.js)</li>
                <li>• Backend development (Node.js, Python)</li>
                <li>• Database design and optimization</li>
                <li>• UI/UX design and implementation</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Technologies I Love
              </h3>
              <div className="flex flex-wrap gap-2">
                {["React", "Next.js", "TypeScript", "Node.js", "Python", "PostgreSQL", "MongoDB", "Tailwind CSS"].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Image Placeholder */}
          <div className="flex justify-center">
            <div className="w-80 h-80 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">Profile Image</span>
            </div>
          </div>
        </div>

        {/* Stats or Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-border">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">5+</div>
            <div className="text-muted-foreground">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">50+</div>
            <div className="text-muted-foreground">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">100%</div>
            <div className="text-muted-foreground">Client Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
}
