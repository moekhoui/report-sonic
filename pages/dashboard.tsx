import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '../src/components/ui/button'
import { 
  FileText, 
  Plus, 
  BarChart3, 
  Clock, 
  TrendingUp,
  Download,
  Share2
} from 'lucide-react'

// Mock data for demonstration
const mockReports = [
  {
    id: '1',
    title: 'Q3 Sales Performance Report',
    description: 'Comprehensive analysis of Q3 sales data',
    status: 'completed',
    createdAt: '2024-01-15',
    template: 'Executive Summary',
    dataRows: 1250,
  },
  {
    id: '2',
    title: 'Marketing Campaign Analysis',
    description: 'ROI analysis for recent marketing campaigns',
    status: 'generating',
    createdAt: '2024-01-14',
    template: 'Marketing Report',
    dataRows: 890,
  },
]

export default function DashboardPage() {
  const [reports, setReports] = useState(mockReports)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200">
            <FileText className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">ReportSonic</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link href="/dashboard" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-primary-100 text-primary-700">
              <BarChart3 className="h-5 w-5 mr-3" />
              Dashboard
            </Link>
            <Link href="/reports" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100">
              <FileText className="h-5 w-5 mr-3" />
              Reports
            </Link>
          </nav>

          {/* Create Report Button */}
          <div className="p-4 border-t border-gray-200">
            <Link href="/reports/new" className="flex items-center justify-center w-full px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Report
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your reports.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <FileText className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reports.filter(r => r.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reports.filter(r => r.status === 'generating').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Reports */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Reports</h2>
              <Link href="/reports">
                <Button variant="ghost">View All</Button>
              </Link>
            </div>

            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="card hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
                          <p className="text-sm text-gray-600">{report.description}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Created {report.createdAt}</span>
                        <span>•</span>
                        <span>{report.dataRows.toLocaleString()} rows</span>
                        <span>•</span>
                        <span>{report.template}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {report.status === 'completed' && (
                        <>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share2 className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="ghost">
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}
