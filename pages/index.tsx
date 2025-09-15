import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../src/lib/auth';
import Link from 'next/link';
import ThemeToggle from '../src/components/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 transition-all duration-500">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-all duration-300">
        <div className="container-modern">
          <div className="flex-between py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-primary rounded-xl shadow-medium animate-glow"></div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">ReportSonic</span>
            </div>
            <div className="flex items-center space-x-6">
              <ThemeToggle />
              <Link href="/auth/signin" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium">
                Sign In
              </Link>
              <Link href="/auth/signup" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section-modern relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container-modern">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8 animate-fade-in-up">
              ✨ AI-Powered Report Generation
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-slate-900 dark:text-white mb-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              Transform Data Into
              <span className="block text-transparent bg-clip-text gradient-primary">
                Stunning Reports
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              Upload your data, choose a template, and let our AI create professional, 
              publication-ready reports in minutes. No design skills required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <Link href="/auth/signup" className="btn btn-primary btn-xl hover-glow">
                Start Creating Free
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="#features" className="btn btn-outline btn-xl">
                Watch Demo
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-slate-900 transition-colors duration-500">
        <div className="container-modern">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Everything You Need for
              <span className="block text-transparent bg-clip-text gradient-primary">Professional Reports</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with intuitive design 
              to make report creation effortless and professional.
            </p>
          </div>
          
          <div className="grid-modern grid-3">
            {[
              {
                icon: "🤖",
                title: "AI-Powered Analysis",
                description: "Advanced AI analyzes your data to identify key insights, trends, and patterns automatically.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: "📊",
                title: "Smart Visualizations",
                description: "Generate stunning charts, graphs, and infographics that make your data come alive.",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: "🎨",
                title: "Professional Templates",
                description: "Choose from dozens of professionally designed report templates for any industry.",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: "🔗",
                title: "Easy Integrations",
                description: "Connect Google Sheets, APIs, or upload CSV files - we support all major data sources.",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: "⚡",
                title: "Lightning Fast",
                description: "Generate comprehensive reports in minutes, not hours. Get results instantly.",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: "💼",
                title: "Brand Customization",
                description: "Customize colors, fonts, and layouts to match your brand perfectly.",
                color: "from-indigo-500 to-purple-500"
              }
            ].map((feature, index) => (
              <div key={index} className="card p-8 hover-lift group">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 transition-colors duration-500">
        <div className="container-modern">
          <div className="grid-modern grid-4 text-center">
            {[
              { number: "10K+", label: "Reports Generated" },
              { number: "500+", label: "Happy Customers" },
              { number: "99.9%", label: "Uptime" },
              { number: "5min", label: "Average Generation Time" }
            ].map((stat, index) => (
              <div key={index} className="animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 dark:text-slate-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container-modern relative z-10">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Data?
            </h2>
            <p className="text-xl mb-12 opacity-90 leading-relaxed">
              Join thousands of professionals who trust ReportSonic for their reporting needs. 
              Start creating stunning reports today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/auth/signup" className="btn btn-secondary btn-xl">
                Get Started Free
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="#features" className="btn btn-ghost btn-xl text-white border-white/30 hover:bg-white/10">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white py-16 transition-colors duration-500">
        <div className="container-modern">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-8 md:mb-0">
              <div className="w-10 h-10 gradient-primary rounded-xl"></div>
              <span className="text-2xl font-bold">ReportSonic</span>
            </div>
            <div className="flex items-center space-x-8">
              <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-slate-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>© 2024 ReportSonic. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  
  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};