import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../src/lib/auth';
import Link from 'next/link';
import ThemeToggle from '../src/components/ThemeToggle';
import Logo from '../src/components/Logo';
import { PricingPlans } from '../src/components/PricingPlans';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800 transition-all duration-500">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="container">
          <div className="flex items-center justify-between py-4">
            <Logo size="md" variant="full" />
            <div className="flex items-center gap-6">
              <ThemeToggle />
              <Link href="/auth/signin" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
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
      <section className="section">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
              AI-Powered Reports
              <span className="block text-transparent bg-clip-text gradient-primary mt-2">
                in Minutes
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-in">
              Transform your data into stunning, professional reports with the power of AI. 
              Upload CSV, connect APIs, and get beautiful insights automatically.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Link href="/auth/signup" className="btn btn-primary btn-lg">
                Start Creating Reports
              </Link>
              <Link href="#features" className="btn btn-outline btn-lg">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section bg-white dark:bg-slate-900">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need for Professional Reports
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our AI-powered platform makes report generation effortless and professional.
            </p>
          </div>
          
          <div className="grid grid-3">
            {[
              {
                icon: "🤖",
                title: "AI Analysis",
                description: "Advanced AI analyzes your data to identify key insights and trends automatically."
              },
              {
                icon: "📊",
                title: "Smart Charts",
                description: "Generate stunning charts and visualizations that make your data come alive."
              },
              {
                icon: "🎨",
                title: "Templates",
                description: "Choose from dozens of professionally designed report templates."
              },
              {
                icon: "🔗",
                title: "Integrations",
                description: "Connect Google Sheets, APIs, or upload CSV files easily."
              },
              {
                icon: "⚡",
                title: "Fast Generation",
                description: "Generate comprehensive reports in minutes, not hours."
              },
              {
                icon: "💼",
                title: "Brand Custom",
                description: "Customize colors, fonts, and layouts to match your brand."
              }
            ].map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section bg-gray-50 dark:bg-slate-800">
        <div className="container">
          <div className="grid grid-4 text-center">
            {[
              { number: "10K+", label: "Reports Generated" },
              { number: "500+", label: "Happy Customers" },
              { number: "99.9%", label: "Uptime" },
              { number: "5min", label: "Avg Generation Time" }
            ].map((stat, index) => (
              <div key={index} className="animate-fade-in">
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section bg-white dark:bg-slate-900">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose the plan that fits your needs. Start free and upgrade anytime.
            </p>
          </div>
          <PricingPlans isPublicPage={true} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="section gradient-primary">
        <div className="container">
          <div className="text-center text-white max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Data?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of professionals who trust ReportSonic for their reporting needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup" className="btn btn-secondary btn-lg">
                Get Started Free
              </Link>
              <Link href="#features" className="btn btn-ghost btn-lg text-white border-white/30 hover:bg-white/10">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-slate-950 text-white py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo size="sm" variant="full" className="mb-4 md:mb-0" />
            <p className="text-gray-400">
              © 2024 ReportSonic. All rights reserved.
            </p>
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