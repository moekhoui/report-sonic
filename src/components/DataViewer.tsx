import React, { useState, useMemo, useRef } from 'react'
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
import type { Chart } from 'chart.js'
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2'
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Table, 
  Download, 
  Filter,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react'
import { exportToFormat, downloadFile, ClientExportOptions, ExportProgress } from '../lib/clientExport'
import html2canvas from 'html2canvas'

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
  reportName?: string
  companyName?: string
  clientName?: string
  onBack?: () => void
}

export default function DataViewer({ data, headers, analysis, reportName = 'Data Analysis Report', companyName = 'ReportSonic AI', clientName, onBack }: DataViewerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'table'>('overview')
  const [selectedCharts, setSelectedCharts] = useState<string[]>([])
  const [showAllData, setShowAllData] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null)
  const [exportFormat, setExportFormat] = useState<'pdf' | 'word' | 'powerpoint'>('pdf')
  const chartInstancesRef = useRef<Map<string, Chart>>(new Map())

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

  // Generate charts for each column with enhanced descriptions
  const charts = useMemo(() => {
    const chartData: Array<{
      id: string
      title: string
      type: string
      data: any
      options?: any
      description?: string
      insights?: string
    }> = []
    
    processedData.columns.forEach((column, index) => {
      if (column.type === 'numeric') {
        const values = processedData.rows
          .map(row => Number(row[index]))
          .filter(val => !isNaN(val))
          .slice(0, 50) // Limit for performance
        
        if (values.length > 0) {
          const avg = values.reduce((a, b) => a + b, 0) / values.length
          const min = Math.min(...values)
          const max = Math.max(...values)
          const median = values.sort((a, b) => a - b)[Math.floor(values.length / 2)]
          
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
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: `${column.key} Distribution`
                }
              }
            },
            description: `This bar chart visualizes the distribution of ${column.key} values across ${values.length} data points. The visualization shows the spread and concentration of values, helping identify patterns and outliers in the dataset.`,
            insights: `Analysis reveals an average value of ${avg.toFixed(2)}, with a range from ${min} to ${max} and a median of ${median.toFixed(2)}. This ${column.key} data shows ${values.length > 20 ? 'good' : 'limited'} sample size for statistical analysis.`
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
          const totalCount = sortedEntries.reduce((sum, [,count]) => sum + count, 0)
          const topValue = sortedEntries[0]
          const topPercentage = ((topValue[1] / totalCount) * 100).toFixed(1)
          
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
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: `${column.key} Distribution`
                }
              }
            },
            description: `This pie chart displays the categorical distribution of ${column.key} values, showing the relative frequency of each category within the dataset. The visualization helps understand the composition and balance of categorical data.`,
            insights: `The most common value is "${topValue[0]}" representing ${topPercentage}% of all records (${topValue[1]} occurrences). This categorical distribution shows ${sortedEntries.length} distinct categories with varying frequencies.`
          })
        }
      }
    })
    
    return chartData
  }, [processedData])

  // Auto-select all charts when charts are generated
  React.useEffect(() => {
    if (charts.length > 0 && selectedCharts.length === 0) {
      setSelectedCharts(charts.map(c => c.id))
    }
  }, [charts, selectedCharts.length])

  // Filter data based on search
  const filteredRows = useMemo(() => {
    if (!searchTerm) return processedData.rows
    
    return processedData.rows.filter(row =>
      row.some(cell => 
        String(cell).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [processedData.rows, searchTerm])

  // Store chart instances for native export
  const storeChartInstance = (chartId: string, chartInstance: Chart) => {
    chartInstancesRef.current.set(chartId, chartInstance)
  }

  // New client-side export function
  const handleExport = async (format: 'pdf' | 'word' | 'powerpoint') => {
    if (charts.length === 0) {
      alert('No charts available to export. Please ensure your data has been processed and charts are generated.')
      return
    }
    
    if (selectedCharts.length === 0) {
      alert('Please select at least one chart to export. Use the "Select All" button or select individual charts.')
      return
    }

    setIsExporting(true)
    setExportProgress({ stage: 'preparing', progress: 0, message: 'Preparing export...' })

    try {
      // Prepare export options with selected charts
      const selectedChartsData = charts.filter(chart => selectedCharts.includes(chart.id))
      
      // Capture chart images using html2canvas
      const chartsWithImages = await Promise.all(selectedChartsData.map(async (chart) => {
        try {
          // Find the chart element in the DOM
          const chartElement = document.querySelector(`[data-chart-id="${chart.id}"]`) as HTMLElement
          if (chartElement) {
            console.log('📊 Capturing chart:', chart.id)
            
            // Wait a bit for chart to be fully rendered
            await new Promise(resolve => setTimeout(resolve, 500))
            
            // Capture the chart using html2canvas
            const canvas = await html2canvas(chartElement, {
              scale: 2,
              useCORS: true,
              allowTaint: true,
              backgroundColor: '#ffffff',
              logging: false,
              width: chartElement.scrollWidth,
              height: chartElement.scrollHeight
            })
            
            const chartImage = canvas.toDataURL('image/png', 1.0)
            console.log('📊 Chart captured successfully:', chart.id)
            
            return {
              ...chart,
              chartInstance: chartInstancesRef.current.get(chart.id),
              capturedImage: chartImage
            }
          } else {
            console.log('📊 Chart element not found:', chart.id)
            return {
              ...chart,
              chartInstance: chartInstancesRef.current.get(chart.id),
              capturedImage: null
            }
          }
        } catch (error) {
          console.error('📊 Failed to capture chart:', chart.id, error)
          return {
            ...chart,
            chartInstance: chartInstancesRef.current.get(chart.id),
            capturedImage: null
          }
        }
      }))
      
      console.log('📊 Total charts processed:', chartsWithImages.length)
      console.log('📊 Charts with captured images:', chartsWithImages.filter(c => c.capturedImage).length)

      const exportOptions: ClientExportOptions = {
        title: reportName,
        companyName: companyName,
        clientName: clientName,
        content: analysis?.summary || 'Data analysis report generated by ReportSonic AI',
        analysis: analysis,
        charts: chartsWithImages,
        rawData: data,
        headers: headers,
        aiIntroduction: `This comprehensive data analysis report presents AI-powered insights derived from ${processedData.rows.length} records across ${processedData.columns.length} data fields. Our advanced analytical engine has processed this dataset to identify patterns, trends, and opportunities within your data. The analysis encompasses statistical analysis, pattern recognition, and predictive insights that translate complex data relationships into actionable business intelligence. Each visualization is accompanied by AI-generated insights that provide context, interpretation, and strategic recommendations. This report serves as a foundation for data-driven decision-making and strategic optimization.`,
        aiConclusion: `Based on our comprehensive analysis of ${processedData.rows.length} data points across ${processedData.columns.length} fields, this report has revealed critical insights that can transform your business strategy. The analysis encompasses ${charts.length} key visualizations that uncover hidden patterns, trends, and opportunities within your dataset. Our AI-powered recommendations focus on leveraging these insights to optimize operational efficiency, identify market opportunities, and drive strategic growth. The data quality assessment and statistical analysis provide a foundation for executive decision-making and competitive advantage. We recommend implementing regular data monitoring, expanding successful patterns identified in the analysis, and using these insights to inform quarterly strategic reviews. The visualizations presented provide actionable intelligence for immediate implementation and long-term strategic planning.`
      }

      // Generate the export
      const blob = await exportToFormat(format, exportOptions, (progress) => {
        setExportProgress(progress)
      })

      // Download the file
      const timestamp = new Date().toISOString().slice(0, 10)
      const filename = `${reportName.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}_report.${format === 'powerpoint' ? 'pptx' : format === 'word' ? 'docx' : 'pdf'}`
      
      downloadFile(blob, filename)
      
      console.log(`✅ ${format.toUpperCase()} export completed successfully`)
      
    } catch (error) {
      console.error(`❌ ${format.toUpperCase()} export failed:`, error)
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsExporting(false)
      setExportProgress(null)
    }
  }

  const renderChart = (chart: any) => {
    const chartRef = (ref: any) => {
      // Wait for chart to be fully rendered before storing instance
      setTimeout(() => {
        if (ref && ref.chartInstance) {
          console.log('📊 Storing chart instance for:', chart.id)
          storeChartInstance(chart.id, ref.chartInstance)
        } else if (ref && ref.canvas && ref.canvas.chart) {
          console.log('📊 Storing canvas chart instance for:', chart.id)
          storeChartInstance(chart.id, ref.canvas.chart)
        }
      }, 100)
    }

    switch (chart.type) {
      case 'bar':
        return <Bar ref={chartRef} data={chart.data} options={chart.options} />
      case 'line':
        return <Line ref={chartRef} data={chart.data} options={chart.options} />
      case 'pie':
        return <Pie ref={chartRef} data={chart.data} options={chart.options} />
      case 'doughnut':
        return <Doughnut ref={chartRef} data={chart.data} options={chart.options} />
      default:
        return <Bar ref={chartRef} data={chart.data} options={chart.options} />
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
                onClick={() => handleExport('pdf')}
                disabled={isExporting || charts.length === 0 || selectedCharts.length === 0}
                className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                title={charts.length === 0 ? 'No charts available' : selectedCharts.length === 0 ? 'Please select charts to export' : 'Export as PDF with native Chart.js quality'}
              >
                {isExporting && exportFormat === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {isExporting && exportFormat === 'pdf' ? 'Exporting...' : `PDF (${selectedCharts.length}/${charts.length})`}
              </button>
              <button
                onClick={() => handleExport('word')}
                disabled={isExporting || charts.length === 0 || selectedCharts.length === 0}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                title={charts.length === 0 ? 'No charts available' : selectedCharts.length === 0 ? 'Please select charts to export' : 'Export as Word Document with native Chart.js quality'}
              >
                {isExporting && exportFormat === 'word' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {isExporting && exportFormat === 'word' ? 'Exporting...' : `Word (${selectedCharts.length}/${charts.length})`}
              </button>
              <button
                onClick={() => handleExport('powerpoint')}
                disabled={isExporting || charts.length === 0 || selectedCharts.length === 0}
                className="bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                title={charts.length === 0 ? 'No charts available' : selectedCharts.length === 0 ? 'Please select charts to export' : 'Export as PowerPoint Presentation with native Chart.js quality'}
              >
                {isExporting && exportFormat === 'powerpoint' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {isExporting && exportFormat === 'powerpoint' ? 'Exporting...' : `PowerPoint (${selectedCharts.length}/${charts.length})`}
              </button>
            </div>
          </div>
        </div>

        {/* Export Progress Indicator */}
        {exportProgress && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Export Progress</h3>
              <span className="text-sm text-gray-600">{exportProgress.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${exportProgress.progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">{exportProgress.message}</p>
          </div>
        )}

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
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Analysis Summary</h3>
                    <p className="text-gray-700 mb-4">{analysis.summary}</p>
                    
                    {analysis.insights && analysis.insights.length > 0 && (
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
                  {charts.map((chart) => (
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
                            className={`px-3 py-1 rounded text-sm transition-colors ${
                              selectedCharts.includes(chart.id)
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {selectedCharts.includes(chart.id) ? '✓ Selected' : 'Select'}
                          </button>
                        </div>
                      </div>

                      {/* Chart Description */}
                      <div className="mb-6">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                          <h5 className="font-medium text-blue-900 mb-2 flex items-center">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            AI-Powered Chart Analysis
                          </h5>
                          <p className="text-blue-800 text-sm leading-relaxed mb-3">{chart.description}</p>
                          <div className="bg-white p-3 rounded border border-blue-200">
                            <h6 className="font-medium text-blue-900 mb-1">Key Insights:</h6>
                            <p className="text-blue-700 text-sm">{chart.insights}</p>
                          </div>
                        </div>
                      </div>

                      {/* Visual Chart */}
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <h5 className="font-medium text-gray-900 mb-4 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Interactive Visualization
                        </h5>
                        <div className="h-80 bg-white rounded border" data-chart-id={chart.id}>
                          {renderChart(chart)}
                        </div>
                      </div>
                    </div>
                  ))}
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
