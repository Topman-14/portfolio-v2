export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "Getting Started with Next.js 15",
      excerpt: "Explore the latest features and improvements in Next.js 15, including the new App Router and enhanced performance optimizations.",
      date: "2024-01-15",
      readTime: "5 min read",
      category: "Development",
      author: "John Doe"
    },
    {
      id: 2,
      title: "Building Scalable React Applications",
      excerpt: "Learn best practices for structuring and organizing large-scale React applications for maintainability and performance.",
      date: "2024-01-10",
      readTime: "8 min read",
      category: "React",
      author: "John Doe"
    },
    {
      id: 3,
      title: "The Power of TypeScript in Modern Web Development",
      excerpt: "Discover how TypeScript can improve your development workflow and help you build more robust applications.",
      date: "2024-01-05",
      readTime: "6 min read",
      category: "TypeScript",
      author: "John Doe"
    },
    {
      id: 4,
      title: "Mastering Tailwind CSS",
      excerpt: "Tips and tricks for getting the most out of Tailwind CSS, from utility-first design to custom component creation.",
      date: "2023-12-28",
      readTime: "7 min read",
      category: "CSS",
      author: "John Doe"
    },
    {
      id: 5,
      title: "Database Design Best Practices",
      excerpt: "Essential principles for designing efficient and scalable database schemas that grow with your application.",
      date: "2023-12-20",
      readTime: "10 min read",
      category: "Database",
      author: "John Doe"
    },
    {
      id: 6,
      title: "Modern JavaScript Features You Should Know",
      excerpt: "A comprehensive guide to the latest JavaScript features that can make your code more efficient and readable.",
      date: "2023-12-15",
      readTime: "9 min read",
      category: "JavaScript",
      author: "John Doe"
    }
  ];

  const categories = ["All", "Development", "React", "TypeScript", "CSS", "Database", "JavaScript"];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Thoughts, tutorials, and insights about web development and technology
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === "All"
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-accent-foreground hover:bg-accent/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Post Image Placeholder */}
              <div className="h-48 bg-accent flex items-center justify-center">
                <span className="text-muted-foreground">Blog Post Image</span>
              </div>

              {/* Post Content */}
              <div className="p-6 space-y-4">
                {/* Category and Date */}
                <div className="flex items-center justify-between text-sm">
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                    {post.category}
                  </span>
                  <span className="text-muted-foreground">
                    {new Date(post.date).toLocaleDateString()}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-card-foreground leading-tight">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">
                        {post.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">{post.author}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{post.readTime}</span>
                </div>

                {/* Read More Button */}
                <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                  Read More
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-accent rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Stay Updated
          </h2>
          <p className="text-muted-foreground mb-6">
            Subscribe to get notified about new blog posts and updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
