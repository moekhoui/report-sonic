'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { analyzeData, generateReportContent, AIAnalysisResult } from '@/lib/ai'
import { FileText, BarChart3, TrendingUp, CheckCircle } from 'lucide-react'

interface ReportPreviewProps {
  data: any[]
  template: string
  title: string
  companyName: string
  clientName?: string
  onAnalysisComplete: (analysis: AIAnalysisResult) => void
}

export function ReportPreview({ 
  data, 
  template, 
  title, 
  companyName, 
  clientName,
  onAnalysisComplete 
}: ReportPreviewProps) {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null)
  const [reportContent, setReportContent] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (data.length > 0) {
      runAnalysis()
    }
  }, [data])

  const runAnalysis = async () => {
    setIsAnalyzing(true)
    try {
      const result = await analyzeData(data)
      setAnalysis(result)
      onAnalysisComplete(result)
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateReport = async () => {
    setIsGenerating(true)
    try {
      const content = await generateReportContent(data, template, title)
      setReportContent(content)
    } catch (error) {
      console.error('Report generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600">
          {companyName} {clientName && `• ${clientName}`}
        </p>
        <p className="text-sm text-gray-500">
          Generated on {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Analysis Status */}
      {isAnalyzing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-800 font-medium">Analyzing your data...</span>
          </div>
        </div>
      )}

      {/* AI Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Data Quality Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="card text-center">
              <div className="text-2xl font-bold text-green-600">{analysis.dataQuality.completeness}%</div>
              <div className="text-sm text-gray-600">Completeness</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-blue-600">{analysis.dataQuality.accuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-purple-600">{analysis.dataQuality.consistency}%</div>
              <div className="text-sm text-gray-600">Consistency</div>
            </div>
          </div>

          {/* Key Findings */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              Key Findings
            </h3>
            <ul className="space-y-2">
              {analysis.keyFindings.map((finding, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Suggested Charts */}
          {analysis.suggestedCharts.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 text-primary-600 mr-2" />
                Data Visualizations
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {analysis.suggestedCharts.map((chart, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{chart.title}</h4>
                    <p className="text-sm text-gray-600 mb-4">{chart.description}</p>
                    <div className="h-48">
                      {chart.type === 'bar' && (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chart.data.slice(0, 5)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill={COLORS[0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                      {chart.type === 'line' && (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chart.data.slice(0, 10)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke={COLORS[1]} strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 text-primary-600 mr-2" />
              Recommendations
            </h3>
            <ul className="space-y-2">
              {analysis.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Generate Report Button */}
          {!reportContent && (
            <div className="text-center">
              <button
                onClick={generateReport}
                disabled={isGenerating}
                className="btn-primary px-8 py-3 text-lg disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                    Generating Report...
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5 mr-2 inline-block" />
                    Generate Full Report
                  </>
                )}
              </button>
            </div>
          )}

          {/* Generated Report Content */}
          {reportContent && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Generated Report</h3>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                  {reportContent}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

