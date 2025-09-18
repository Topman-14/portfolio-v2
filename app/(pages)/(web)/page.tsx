import Link from "next/link";
import { ArrowRight, Code, Palette, Zap } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Code,
      title: "Clean Code",
      description: "Writing maintainable, scalable, and well-documented code that follows best practices."
    },
    {
      icon: Palette,
      title: "Modern Design",
      description: "Creating beautiful, intuitive user interfaces with attention to detail and user experience."
    },
    {
      icon: Zap,
      title: "Performance",
      description: "Building fast, optimized applications that provide excellent user experience across all devices."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
              Hi, I&apos;m{" "}
              <span className="text-primary">Your Name</span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Full-Stack Developer crafting digital experiences with modern technologies
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/work"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              View My Work
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center px-6 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-accent transition-colors"
            >
              About Me
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            What I Bring to the Table
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Combining technical expertise with creative problem-solving to deliver exceptional results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-accent rounded-lg text-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground">
            Ready to Start Your Next Project?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Let&apos;s work together to bring your ideas to life. I&apos;m always excited to take on new challenges and create something amazing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Read My Blog
            </Link>
            <button className="inline-flex items-center px-6 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-background transition-colors">
              Get In Touch
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
