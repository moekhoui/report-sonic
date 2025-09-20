import React, { useState, useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2'
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Table, 
  Download, 
  Filter,
  Eye,
  EyeOff
} from 'lucide-react'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface DataViewerProps {
  data: any[][]
  headers: string[]
  analysis: any
  onExportPDF: () => void
  onExportWord: () => void
  onExportPowerPoint: () => void
  onBack?: () => void
}

export default function DataViewer({ data, headers, analysis, onExportPDF, onExportWord, onExportPowerPoint, onBack }: DataViewerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'table'>('overview')
  const [selectedCharts, setSelectedCharts] = useState<string[]>([])
  const [showAllData, setShowAllData] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Process data for display
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return { rows: [], columns: [] }
    
    const rows = data.slice(1) // Remove header row
    const columns = headers.map((header, index) => ({
      key: header,
      index,
      type: detectColumnType(rows, index)
    }))
    
    return { rows, columns }
  }, [data, headers])

  // Detect column type for better visualization
  function detectColumnType(rows: any[][], columnIndex: number): 'numeric' | 'text' | 'date' {
    const sample = rows.slice(0, Math.min(10, rows.length)).map(row => row[columnIndex])
    
    // Check if all are numbers
    if (sample.every(val => !isNaN(Number(val)) && val !== '')) {
      return 'numeric'
    }
    
    // Check if all are dates
    if (sample.every(val => {
      const date = new Date(val)
      return !isNaN(date.getTime())
    })) {
      return 'date'
    }
    
    return 'text'
  }

  // Generate charts for each column
  const charts = useMemo(() => {
    const chartData: Array<{
      id: string
      title: string
      type: string
      data: any
      options?: any
    }> = []
    
    processedData.columns.forEach((column, index) => {
      if (column.type === 'numeric') {
        const values = processedData.rows
          .map(row => Number(row[index]))
          .filter(val => !isNaN(val))
          .slice(0, 50) // Limit for performance
        
        if (values.length > 0) {
          chartData.push({
            id: `chart-${index}`,
            title: column.key,
            type: 'bar',
            data: {
              labels: values.map((_, i) => `Point ${i + 1}`),
              datasets: [{
                label: column.key,
                data: values,
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: `${column.key} Distribution`
                }
              }
            }
          })
        }
      } else if (column.type === 'text') {
        const valueCounts: { [key: string]: number } = {}
        processedData.rows.forEach(row => {
          const value = String(row[index] || '')
          if (value) {
            valueCounts[value] = (valueCounts[value] || 0) + 1
          }
        })
        
        const sortedEntries = Object.entries(valueCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10) // Top 10 values
        
        if (sortedEntries.length > 0) {
          chartData.push({
            id: `chart-${index}`,
            title: column.key,
            type: 'pie',
            data: {
              labels: sortedEntries.map(([key]) => key),
              datasets: [{
                data: sortedEntries.map(([,count]) => count),
                backgroundColor: [
                  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
                  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
                ]
              }]
            },
            options: {
              responsive: true,
              plugins: {
                title: {
                  display: true,
                  text: `${column.key} Distribution`
                }
              }
            }
          })
        }
      }
    })
    
    return chartData
  }, [processedData])

  // Filter data based on search
  const filteredRows = useMemo(() => {
    if (!searchTerm) return processedData.rows
    
    return processedData.rows.filter(row =>
      row.some(cell => 
        String(cell).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [processedData.rows, searchTerm])

  const renderChart = (chart: any) => {
    switch (chart.type) {
      case 'bar':
        return <Bar data={chart.data} options={chart.options} />
      case 'line':
        return <Line data={chart.data} options={chart.options} />
      case 'pie':
        return <Pie data={chart.data} options={chart.options} />
      case 'doughnut':
        return <Doughnut data={chart.data} options={chart.options} />
      default:
        return <Bar data={chart.data} options={chart.options} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                >
                  ← Back to Dashboard
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Data Analytics Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  {processedData.rows.length} rows × {processedData.columns.length} columns
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onExportPDF}
                className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm"
                title="Export as PDF"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
              <button
                onClick={onExportWord}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
                title="Export as Word Document"
              >
                <Download className="w-4 h-4" />
                Word
              </button>
              <button
                onClick={onExportPowerPoint}
                className="bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2 text-sm"
                title="Export as PowerPoint Presentation"
              >
                <Download className="w-4 h-4" />
                PowerPoint
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Eye },
                { id: 'charts', label: 'Charts', icon: BarChart3 },
                { id: 'table', label: 'Data Table', icon: Table }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as 'overview' | 'charts' | 'table')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900">Data Summary</h3>
                    <p className="text-2xl font-bold text-blue-600 mt-2">
                      {processedData.rows.length.toLocaleString()}
                    </p>
                    <p className="text-blue-700 text-sm">Total Records</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900">Columns</h3>
                    <p className="text-2xl font-bold text-green-600 mt-2">
                      {processedData.columns.length}
                    </p>
                    <p className="text-green-700 text-sm">Data Fields</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-900">Data Types</h3>
                    <p className="text-2xl font-bold text-purple-600 mt-2">
                      {processedData.columns.filter(c => c.type === 'numeric').length}
                    </p>
                    <p className="text-purple-700 text-sm">Numeric Columns</p>
                  </div>
                </div>

                {analysis && (
                  <div className="space-y-6">
                    {/* Analysis Summary */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">📊 Analysis Summary</h3>
                      <p className="text-gray-700 mb-4">{analysis.summary || 'No analysis summary available.'}</p>
                      
                      {analysis.insights && Array.isArray(analysis.insights) && analysis.insights.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold mb-2">Key Insights:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {analysis.insights.slice(0, 5).map((insight: string, index: number) => (
                              <li key={index} className="text-gray-700">{insight}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Patterns Section */}
                    {analysis.trends && Array.isArray(analysis.trends) && analysis.trends.length > 0 && (
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4 text-blue-900">🔍 Data Patterns</h3>
                        <ul className="space-y-2">
                          {analysis.trends.map((trend: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span>
                              <span className="text-blue-800">{trend}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommendations Section */}
                    {analysis.recommendations && Array.isArray(analysis.recommendations) && analysis.recommendations.length > 0 && (
                      <div className="bg-green-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4 text-green-900">💡 Recommendations</h3>
                        <ul className="space-y-2">
                          {analysis.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-500 mt-1">•</span>
                              <span className="text-green-800">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Statistics Section */}
                    {analysis.statistics && Array.isArray(analysis.statistics) && analysis.statistics.length > 0 && (
                      <div className="bg-purple-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4 text-purple-900">📈 Statistical Analysis</h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full">
                            <thead>
                              <tr className="border-b border-purple-200">
                                <th className="text-left py-2 text-purple-800">Column</th>
                                <th className="text-left py-2 text-purple-800">Count</th>
                                <th className="text-left py-2 text-purple-800">Average</th>
                                <th className="text-left py-2 text-purple-800">Min</th>
                                <th className="text-left py-2 text-purple-800">Max</th>
                              </tr>
                            </thead>
                            <tbody>
                              {analysis.statistics.slice(0, 5).map((stat: any, index: number) => (
                                <tr key={index} className="border-b border-purple-100">
                                  <td className="py-2 font-medium text-purple-700">{stat?.column || 'N/A'}</td>
                                  <td className="py-2 text-purple-600">{stat?.count || 'N/A'}</td>
                                  <td className="py-2 text-purple-600">{stat?.average ? stat.average.toFixed(2) : 'N/A'}</td>
                                  <td className="py-2 text-purple-600">{stat?.min || 'N/A'}</td>
                                  <td className="py-2 text-purple-600">{stat?.max || 'N/A'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Charts Tab */}
            {activeTab === 'charts' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Data Visualizations with AI Descriptions</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedCharts(charts.map(c => c.id))}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Select All
                    </button>
                    <button
                      onClick={() => setSelectedCharts([])}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {charts.map((chart) => {
                    // Generate AI description for this chart
                    const generateDescription = (chart: any) => {
                      if (chart.type === 'bar') {
                        const values = chart.data.datasets[0].data
                        const avg = values.reduce((a: number, b: number) => a + b, 0) / values.length
                        const min = Math.min(...values)
                        const max = Math.max(...values)
                        return `This bar chart visualizes the distribution of ${chart.title} values. The data shows ${values.length} data points with an average of ${avg.toFixed(2)}, ranging from ${min} to ${max}. This visualization helps identify patterns and outliers in the ${chart.title} data.`
                      } else if (chart.type === 'pie') {
                        const totalCount = chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0)
                        const topValue = chart.data.labels[0]
                        const topCount = chart.data.datasets[0].data[0]
                        return `This pie chart shows the distribution of ${chart.title} categories. The most common value is "${topValue}" with ${topCount} occurrences (${((topCount / totalCount) * 100).toFixed(1)}% of total). This visualization helps understand the categorical distribution and identify dominant categories.`
                      }
                      return `This ${chart.type} chart provides insights into the ${chart.title} data distribution.`
                    }

                    const description = generateDescription(chart)

                    return (
                      <div key={chart.id} className="bg-white border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="font-semibold text-xl">{chart.title}</h4>
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                              {chart.type.toUpperCase()}
                            </span>
                            <button
                              onClick={() => {
                                setSelectedCharts(prev =>
                                  prev.includes(chart.id)
                                    ? prev.filter(id => id !== chart.id)
                                    : [...prev, chart.id]
                                )
                              }}
                              className={`px-3 py-1 rounded text-sm ${
                                selectedCharts.includes(chart.id)
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {selectedCharts.includes(chart.id) ? 'Selected' : 'Select'}
                            </button>
                          </div>
                        </div>

                        {/* Chart Description */}
                        <div className="mb-6">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-medium text-gray-900 mb-2">📊 Chart Analysis:</h5>
                            <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
                          </div>
                        </div>

                        {/* Visual Chart */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-4">📊 Visual Chart:</h5>
                          <div className="h-80">
                            {renderChart(chart)}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Table Tab */}
            {activeTab === 'table' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Data Table</h3>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search data..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                    <button
                      onClick={() => setShowAllData(!showAllData)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                      {showAllData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showAllData ? 'Show Less' : 'Show All'}
                    </button>
                  </div>
                </div>

                <div className="bg-white border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {headers.map((header, index) => (
                            <th
                              key={index}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {(showAllData ? filteredRows : filteredRows.slice(0, 100)).map((row, rowIndex) => (
                          <tr key={rowIndex} className="hover:bg-gray-50">
                            {row.map((cell, cellIndex) => (
                              <td
                                key={cellIndex}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                              >
                                {String(cell || '')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {!showAllData && filteredRows.length > 100 && (
                    <div className="bg-gray-50 px-6 py-3 text-sm text-gray-500">
                      Showing 100 of {filteredRows.length} rows. 
                      <button
                        onClick={() => setShowAllData(true)}
                        className="text-blue-600 hover:text-blue-800 ml-1"
                      >
                        Show all
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
