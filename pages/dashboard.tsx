import { useAuth } from '../src/contexts/AuthContext'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import DataViewer from '../src/components/DataViewer'

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/reports/upload', {
        method: 'POST',
        body: formData,
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

  const handleExportReport = async (report: any, format: 'pdf' | 'word' | 'powerpoint' = 'pdf', chartImages?: string[]) => {
    try {
      // Get the raw data for chart generation
      const rawData = report.rawData || []
      const headers = report.headers || []
      
      const response = await fetch('/api/reports/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          report,
          rawData,
          headers,
          format,
          chartImages // Include captured chart images
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        
        // Set appropriate file extension based on format
        const extensions = {
          pdf: 'pdf',
          word: 'docx',
          powerpoint: 'pptx'
        }
        
        a.download = `${report.name.replace(/\.[^/.]+$/, '')}_ai_report.${extensions[format]}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        const errorData = await response.json()
        alert(`Export failed: ${errorData.error || 'Please try again.'}`)
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    }
  }

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
        onExportPDF={(chartImages) => handleExportReport(selectedReport, 'pdf', chartImages)}
        onExportWord={(chartImages) => handleExportReport(selectedReport, 'word', chartImages)}
        onExportPowerPoint={(chartImages) => handleExportReport(selectedReport, 'powerpoint', chartImages)}
        onBack={() => setSelectedReport(null)}
      />
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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

        {/* Upload Section */}
        <div style={{ 
          background: '#f8f9fa',
          padding: '30px',
          borderRadius: '12px',
          marginBottom: '40px',
          border: '2px dashed #dee2e6',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            color: '#333',
            fontSize: '24px',
            marginBottom: '15px'
          }}>
            📊 Upload Excel File
          </h2>
          
          <p style={{ 
            color: '#666',
            marginBottom: '20px',
            fontSize: '16px'
          }}>
            Upload your Excel file and let AI generate a comprehensive report
          </p>

          <div style={{ position: 'relative', display: 'inline-block' }}>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              disabled={uploading}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: uploading ? 'not-allowed' : 'pointer'
              }}
            />
            <button
              disabled={uploading}
              style={{
                padding: '15px 30px',
                background: uploading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: uploading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {uploading ? 'Processing...' : '📁 Choose File'}
            </button>
          </div>
        </div>

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
                          padding: '8px 16px',
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontWeight: '500',
                          marginRight: '8px'
                        }}
                      >
                        📊 View Data
                      </button>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() => handleExportReport(report, 'pdf')}
                          style={{
                            padding: '6px 12px',
                            background: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '11px',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                          title="Export as PDF"
                        >
                          📄 PDF
                        </button>
                        <button
                          onClick={() => handleExportReport(report, 'word')}
                          style={{
                            padding: '6px 12px',
                            background: '#1976d2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '11px',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                          title="Export as Word Document"
                        >
                          📝 Word
                        </button>
                        <button
                          onClick={() => handleExportReport(report, 'powerpoint')}
                          style={{
                            padding: '6px 12px',
                            background: '#ea580c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '11px',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                          title="Export as PowerPoint Presentation"
                        >
                          📊 PPT
                        </button>
                      </div>
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