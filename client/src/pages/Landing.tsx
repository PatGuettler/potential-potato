import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/5">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                <i className="fas fa-atom text-primary-foreground text-2xl"></i>
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6" data-testid="hero-title">
              STEM Academy
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="hero-description">
              Master Science, Technology, Engineering, and Mathematics through interactive lessons, 
              real-world problems, and hands-on coding experiences.
            </p>
            <Button 
              size="lg" 
              className="text-lg px-8 py-4"
              onClick={() => window.location.href = '/api/login'}
              data-testid="login-button"
            >
              <i className="fas fa-rocket mr-2"></i>
              Get Started
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm" data-testid="feature-interactive">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-play text-blue-600 text-xl"></i>
              </div>
              <h3 className="font-semibold mb-2">Interactive Lessons</h3>
              <p className="text-sm text-muted-foreground">
                Engage with dynamic content across all STEM categories
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-sm" data-testid="feature-code-editor">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-code text-purple-600 text-xl"></i>
              </div>
              <h3 className="font-semibold mb-2">Code Editor</h3>
              <p className="text-sm text-muted-foreground">
                Built-in IDE with syntax highlighting for C++, Java, and C#
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-sm" data-testid="feature-real-world">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-globe text-green-600 text-xl"></i>
              </div>
              <h3 className="font-semibold mb-2">Real-World Problems</h3>
              <p className="text-sm text-muted-foreground">
                Solve industry challenges and current scientific problems
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-sm" data-testid="feature-progress">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-chart-line text-orange-600 text-xl"></i>
              </div>
              <h3 className="font-semibold mb-2">Track Progress</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your learning journey with detailed analytics
              </p>
            </div>
          </div>

          {/* STEM Categories Preview */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8" data-testid="categories-title">Explore STEM Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow" data-testid="preview-science">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-microscope text-white text-2xl"></i>
                </div>
                <h3 className="font-semibold mb-2">Science</h3>
                <p className="text-sm text-muted-foreground">
                  60 lessons in biology, chemistry, physics, and earth science
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow" data-testid="preview-technology">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-laptop-code text-white text-2xl"></i>
                </div>
                <h3 className="font-semibold mb-2">Technology</h3>
                <p className="text-sm text-muted-foreground">
                  60 lessons in programming, AI, cybersecurity, and data science
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow" data-testid="preview-engineering">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-cogs text-white text-2xl"></i>
                </div>
                <h3 className="font-semibold mb-2">Engineering</h3>
                <p className="text-sm text-muted-foreground">
                  60 lessons in mechanical, electrical, civil, and software engineering
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow" data-testid="preview-mathematics">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-calculator text-white text-2xl"></i>
                </div>
                <h3 className="font-semibold mb-2">Mathematics</h3>
                <p className="text-sm text-muted-foreground">
                  60 lessons in algebra, calculus, statistics, and applied math
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4" data-testid="cta-title">Ready to Start Learning?</h2>
            <p className="text-lg mb-6 opacity-90" data-testid="cta-description">
              Join thousands of students mastering STEM subjects through our interactive platform
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-4"
              onClick={() => window.location.href = '/api/login'}
              data-testid="cta-button"
            >
              Begin Your Journey
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
