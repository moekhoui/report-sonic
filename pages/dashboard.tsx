import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../src/lib/auth';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import ThemeToggle from '../src/components/ThemeToggle';

export default function Dashboard({ user }: { user: any }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-all duration-500">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="container">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-primary rounded-lg"></div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">ReportSonic</span>
            </div>
            <div className="flex items-center gap-6">
              <ThemeToggle />
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Welcome, {user?.name || user?.email}
                </div>
                <button
                  onClick={() => signOut()}
                  className="btn btn-outline btn-sm"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome to your ReportSonic dashboard. Create and manage your AI-powered reports.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-3 mb-8">
          <div className="card text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Create Report</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Generate a new AI-powered report from your data</p>
            <button className="btn btn-primary">Start Creating</button>
          </div>
          
          <div className="card text-center">
            <div className="text-4xl mb-4">📁</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Upload Data</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Upload CSV files or connect to data sources</p>
            <button className="btn btn-outline">Upload Files</button>
          </div>
          
          <div className="card text-center">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Settings</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Manage your account and preferences</p>
            <button className="btn btn-outline">Open Settings</button>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Reports</h2>
          <div className="space-y-4">
            {[
              {
                title: "Q4 Sales Analysis",
                date: "2024-01-15",
                status: "Completed",
                type: "Sales Report"
              },
              {
                title: "Marketing Performance",
                date: "2024-01-14",
                status: "In Progress",
                type: "Marketing Report"
              },
              {
                title: "Financial Summary",
                date: "2024-01-13",
                status: "Completed",
                type: "Financial Report"
              }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{report.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{report.type} • {report.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    report.status === 'Completed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {report.status}
                  </span>
                  <button className="btn btn-ghost btn-sm">View</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Overview */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What You Can Do</h2>
          <div className="grid grid-2">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">AI-Powered Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Upload your data and let our AI analyze it to identify key insights, trends, and patterns automatically.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Automatic data analysis</li>
                <li>• Trend identification</li>
                <li>• Insight generation</li>
                <li>• Pattern recognition</li>
              </ul>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Professional Reports</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Generate beautiful, professional reports with charts, graphs, and visualizations.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Multiple chart types</li>
                <li>• Custom templates</li>
                <li>• Brand customization</li>
                <li>• Export options</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: session.user,
    },
  };
};