import { useAuth } from '../src/contexts/AuthContext'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import DataViewer from '../src/components/DataViewer'
import { DashboardHeader } from '../src/components/DashboardHeader'
import { EnhancedFileUpload } from '../src/components/EnhancedFileUpload'
import Logo from '../src/components/Logo'

export default function Dashboard() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [reports, setReports] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [selectedReport, setSelectedReport] = useState<any>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    }
  }, [user, loading, router])

  const handleFileUpload = async (file: File, customPrompt?: string) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (customPrompt) {
        formData.append('customPrompt', customPrompt)
      }

      const response = await fetch('/api/reports/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Cache-Control': 'no-cache',
          'X-Requested-With': 'XMLHttpRequest'
        }
      })

      const result = await response.json()

      if (response.ok) {
        const newReport = {
          id: result.report.id,
          name: result.report.name,
          status: 'Completed',
          createdAt: result.report.createdAt,
          analysis: result.report.analysis,
          rawData: result.report.rawData,
          headers: result.report.headers
        }
        
        // Add to reports list
        setReports(prev => [...prev, newReport])
        
        // Set as selected report for immediate viewing
        setSelectedReport(newReport)
        
        console.log('✅ File processed successfully:', result.report.name)
      } else {
        console.error('❌ Upload failed:', result.error)
        alert('Upload failed: ' + result.error)
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  // Remove old export function - now handled by DataViewer component

  const handleLogout = async () => {
    await logout()
    router.push('/auth/signin')
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Show DataViewer if a report is selected
  if (selectedReport) {
    return (
      <DataViewer
        data={selectedReport.rawData || []}
        headers={selectedReport.headers || []}
        analysis={selectedReport.analysis}
        reportName={selectedReport.name}
        companyName="ReportSonic AI"
        clientName={user?.name}
        onBack={() => setSelectedReport(null)}
      />
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '10px',
        padding: '40px',
        maxWidth: '1200px',
        margin: '0 auto',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '40px',
          paddingBottom: '20px',
          borderBottom: '2px solid #f0f0f0'
        }}>
          <div>
            <div style={{ marginBottom: '20px' }}>
              <Logo size="lg" variant="full" />
            </div>
            <h1 style={{ 
              color: '#333',
              fontSize: '32px',
              fontWeight: 'bold',
              margin: 0,
              marginBottom: '5px'
            }}>
              Welcome back, {user.name}! 🎉
            </h1>
            <p style={{ 
              color: '#666',
              fontSize: '16px',
              margin: 0
            }}>
              Transform your data into powerful reports with AI
            </p>
          </div>
          
        <div style={{ display: 'flex', gap: '10px' }}>
          {(user as any)?.role === 'superadmin' && (
            <button
              onClick={() => router.push('/admin/users')}
              style={{
                padding: '12px 24px',
                background: '#6f42c1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background 0.3s'
              }}
              onMouseOver={(e) => (e.target as HTMLButtonElement).style.background = '#5a32a3'}
              onMouseOut={(e) => (e.target as HTMLButtonElement).style.background = '#6f42c1'}
            >
              Admin Panel
            </button>
          )}
          <button
            onClick={() => router.push('/subscription')}
            style={{
              padding: '12px 24px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background 0.3s'
            }}
            onMouseOver={(e) => (e.target as HTMLButtonElement).style.background = '#218838'}
            onMouseOut={(e) => (e.target as HTMLButtonElement).style.background = '#28a745'}
          >
            Subscription
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '12px 24px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background 0.3s'
            }}
            onMouseOver={(e) => (e.target as HTMLButtonElement).style.background = '#c82333'}
            onMouseOut={(e) => (e.target as HTMLButtonElement).style.background = '#dc3545'}
          >
            Sign Out
          </button>
        </div>
        </div>

        {/* Enhanced File Upload Section - Moved to Top */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🚀 Generate AI-Powered Reports
            </h2>
            <p className="text-gray-600">
              Upload your Excel or CSV file and let our AI create comprehensive insights and visualizations
            </p>
          </div>
          
          <EnhancedFileUpload
            onFileUpload={handleFileUpload}
            uploading={uploading}
            className="max-w-2xl mx-auto"
          />
        </div>

        {/* Dashboard Header with Usage Display */}
        <DashboardHeader
          onFileUpload={handleFileUpload}
          uploading={uploading}
        />

        {/* Features Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: '#e3f2fd',
            padding: '25px',
            borderRadius: '12px',
            border: '1px solid #bbdefb'
          }}>
            <h3 style={{ 
              color: '#1976d2',
              fontSize: '20px',
              marginBottom: '15px'
            }}>
              🤖 AI-Powered Analysis
            </h3>
            <p style={{ 
              color: '#666',
              lineHeight: '1.6',
              margin: 0
            }}>
              Our AI analyzes your data patterns and generates insights automatically
            </p>
          </div>

          <div style={{
            background: '#e8f5e8',
            padding: '25px',
            borderRadius: '12px',
            border: '1px solid #c8e6c9'
          }}>
            <h3 style={{ 
              color: '#388e3c',
              fontSize: '20px',
              marginBottom: '15px'
            }}>
              📈 Smart Visualizations
            </h3>
            <p style={{ 
              color: '#666',
              lineHeight: '1.6',
              margin: 0
            }}>
              Create beautiful charts and graphs that tell your data's story
            </p>
          </div>

          <div style={{
            background: '#fff3e0',
            padding: '25px',
            borderRadius: '12px',
            border: '1px solid #ffcc02'
          }}>
            <h3 style={{ 
              color: '#f57c00',
              fontSize: '20px',
              marginBottom: '15px'
            }}>
              📄 Export Reports
            </h3>
            <p style={{ 
              color: '#666',
              lineHeight: '1.6',
              margin: 0
            }}>
              Export your reports as PDF, Excel, or PowerPoint presentations
            </p>
          </div>
        </div>

        {/* Reports List */}
        {reports.length > 0 && (
          <div>
            <h2 style={{ 
              color: '#333',
              fontSize: '24px',
              marginBottom: '20px'
            }}>
              📋 Your Reports
            </h2>
            
            <div style={{ 
              background: '#f8f9fa',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              {reports.map((report: any) => (
                <div key={report.id} style={{
                  padding: '20px',
                  borderBottom: '1px solid #dee2e6'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <div>
                      <h4 style={{ 
                        color: '#333',
                        fontSize: '16px',
                        margin: 0,
                        marginBottom: '5px'
                      }}>
                        {report.name}
                      </h4>
                      <p style={{ 
                        color: '#666',
                        fontSize: '14px',
                        margin: 0
                      }}>
                        Created: {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{
                        padding: '6px 12px',
                        background: '#e8f5e8',
                        color: '#388e3c',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {report.status}
                      </span>
                      <button
                        onClick={() => setSelectedReport(report)}
                        style={{
                          padding: '10px 20px',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)',
                          transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => {
                          const target = e.target as HTMLButtonElement
                          target.style.transform = 'translateY(-2px)'
                          target.style.boxShadow = '0 4px 8px rgba(16, 185, 129, 0.4)'
                        }}
                        onMouseOut={(e) => {
                          const target = e.target as HTMLButtonElement
                          target.style.transform = 'translateY(0)'
                          target.style.boxShadow = '0 2px 4px rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        📊 View & Export Data
                      </button>
                    </div>
                  </div>
                  
                  {/* Enhanced AI Analysis Display */}
                  {report.analysis && (
                    <div style={{
                      background: 'white',
                      padding: '15px',
                      borderRadius: '6px',
                      border: '1px solid #e0e0e0'
                    }}>
                      <h5 style={{ 
                        color: '#333',
                        fontSize: '14px',
                        margin: '0 0 10px 0',
                        fontWeight: '600'
                      }}>
                        🤖 AI Analysis Summary
                      </h5>
                      <p style={{ 
                        color: '#666',
                        fontSize: '13px',
                        margin: '0 0 15px 0',
                        lineHeight: '1.4'
                      }}>
                        {report.analysis.summary}
                      </p>
                      
                      {/* Data Types Overview */}
                      {report.analysis.dataTypes && (
                        <div style={{ 
                          display: 'flex', 
                          gap: '10px', 
                          marginBottom: '15px',
                          flexWrap: 'wrap'
                        }}>
                          <span style={{
                            padding: '4px 8px',
                            background: '#e3f2fd',
                            color: '#1976d2',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '500'
                          }}>
                            🔢 {report.analysis.dataTypes.numeric} Numeric
                          </span>
                          <span style={{
                            padding: '4px 8px',
                            background: '#e8f5e8',
                            color: '#388e3c',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '500'
                          }}>
                            📝 {report.analysis.dataTypes.text} Text
                          </span>
                          <span style={{
                            padding: '4px 8px',
                            background: '#fff3e0',
                            color: '#f57c00',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '500'
                          }}>
                            📅 {report.analysis.dataTypes.date} Date
                          </span>
                        </div>
                      )}
                      
                      {/* Key Insights */}
                      {report.analysis.insights && report.analysis.insights.length > 0 && (
                        <div style={{ marginBottom: '15px' }}>
                          <h6 style={{ 
                            color: '#333',
                            fontSize: '12px',
                            margin: '0 0 8px 0',
                            fontWeight: '600'
                          }}>
                            🔍 Key Insights:
                          </h6>
                          <ul style={{ 
                            margin: 0, 
                            paddingLeft: '15px',
                            color: '#666',
                            fontSize: '12px',
                            lineHeight: '1.4'
                          }}>
                            {report.analysis.insights.slice(0, 5).map((insight: string, index: number) => (
                              <li key={index} style={{ marginBottom: '3px' }}>{insight}</li>
                            ))}
                            {report.analysis.insights.length > 5 && (
                              <li style={{ color: '#999', fontStyle: 'italic' }}>
                                +{report.analysis.insights.length - 5} more insights...
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Trends */}
                      {report.analysis.trends && report.analysis.trends.length > 0 && (
                        <div style={{ marginBottom: '15px' }}>
                          <h6 style={{ 
                            color: '#333',
                            fontSize: '12px',
                            margin: '0 0 8px 0',
                            fontWeight: '600'
                          }}>
                            📈 Trends Detected:
                          </h6>
                          <ul style={{ 
                            margin: 0, 
                            paddingLeft: '15px',
                            color: '#666',
                            fontSize: '12px',
                            lineHeight: '1.4'
                          }}>
                            {report.analysis.trends.slice(0, 3).map((trend: string, index: number) => (
                              <li key={index} style={{ marginBottom: '3px' }}>{trend}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Patterns */}
                      {report.analysis.patterns && report.analysis.patterns.length > 0 && (
                        <div style={{ marginBottom: '15px' }}>
                          <h6 style={{ 
                            color: '#333',
                            fontSize: '12px',
                            margin: '0 0 8px 0',
                            fontWeight: '600'
                          }}>
                            🔍 Patterns Found:
                          </h6>
                          <ul style={{ 
                            margin: 0, 
                            paddingLeft: '15px',
                            color: '#666',
                            fontSize: '12px',
                            lineHeight: '1.4'
                          }}>
                            {report.analysis.patterns.slice(0, 3).map((pattern: string, index: number) => (
                              <li key={index} style={{ marginBottom: '3px' }}>{pattern}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Quality Issues */}
                      {report.analysis.qualityIssues && report.analysis.qualityIssues.length > 0 && (
                        <div style={{ marginBottom: '15px' }}>
                          <h6 style={{ 
                            color: '#d32f2f',
                            fontSize: '12px',
                            margin: '0 0 8px 0',
                            fontWeight: '600'
                          }}>
                            ⚠️ Data Quality Issues:
                          </h6>
                          <ul style={{ 
                            margin: 0, 
                            paddingLeft: '15px',
                            color: '#d32f2f',
                            fontSize: '12px',
                            lineHeight: '1.4'
                          }}>
                            {report.analysis.qualityIssues.slice(0, 3).map((issue: string, index: number) => (
                              <li key={index} style={{ marginBottom: '3px' }}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Recommendations */}
                      {report.analysis.recommendations && report.analysis.recommendations.length > 0 && (
                        <div style={{ marginBottom: '10px' }}>
                          <h6 style={{ 
                            color: '#333',
                            fontSize: '12px',
                            margin: '0 0 8px 0',
                            fontWeight: '600'
                          }}>
                            💡 AI Recommendations:
                          </h6>
                          <ul style={{ 
                            margin: 0, 
                            paddingLeft: '15px',
                            color: '#666',
                            fontSize: '12px',
                            lineHeight: '1.4'
                          }}>
                            {report.analysis.recommendations.slice(0, 4).map((rec: string, index: number) => (
                              <li key={index} style={{ marginBottom: '3px' }}>{rec}</li>
                            ))}
                            {report.analysis.recommendations.length > 4 && (
                              <li style={{ color: '#999', fontStyle: 'italic' }}>
                                +{report.analysis.recommendations.length - 4} more recommendations...
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Account Info */}
        <div style={{ 
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '40px'
        }}>
          <h3 style={{ 
            color: '#333',
            fontSize: '18px',
            marginBottom: '15px'
          }}>
            Account Information
          </h3>
          
          <div style={{ display: 'grid', gap: '10px' }}>
            <div>
              <strong>Name:</strong> {user.name}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div>
              <strong>Plan:</strong> {user.subscription_plan}
            </div>
            <div>
              <strong>Status:</strong> {user.subscription_status}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}