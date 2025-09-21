import { useState } from 'react'
import DataViewer from '../src/components/DataViewer'

export default function TestExport() {
  // Sample test data
  const testData = [
    ['Product', 'Sales', 'Region', 'Quarter'],
    ['Laptop', 1200, 'North', 'Q1'],
    ['Mouse', 45, 'North', 'Q1'],
    ['Keyboard', 80, 'North', 'Q1'],
    ['Monitor', 300, 'North', 'Q1'],
    ['Laptop', 1350, 'South', 'Q1'],
    ['Mouse', 52, 'South', 'Q1'],
    ['Keyboard', 95, 'South', 'Q1'],
    ['Monitor', 320, 'South', 'Q1'],
    ['Laptop', 1100, 'North', 'Q2'],
    ['Mouse', 48, 'North', 'Q2'],
    ['Keyboard', 85, 'North', 'Q2'],
    ['Monitor', 310, 'North', 'Q2'],
    ['Laptop', 1400, 'South', 'Q2'],
    ['Mouse', 55, 'South', 'Q2'],
    ['Keyboard', 90, 'South', 'Q2'],
    ['Monitor', 330, 'South', 'Q2'],
    ['Laptop', 1250, 'North', 'Q3'],
    ['Mouse', 50, 'North', 'Q3'],
    ['Keyboard', 88, 'North', 'Q3'],
    ['Monitor', 315, 'North', 'Q3'],
    ['Laptop', 1450, 'South', 'Q3'],
    ['Mouse', 58, 'South', 'Q3'],
    ['Keyboard', 92, 'South', 'Q3'],
    ['Monitor', 340, 'South', 'Q3'],
    ['Laptop', 1300, 'North', 'Q4'],
    ['Mouse', 49, 'North', 'Q4'],
    ['Keyboard', 86, 'North', 'Q4'],
    ['Monitor', 325, 'North', 'Q4'],
    ['Laptop', 1500, 'South', 'Q4'],
    ['Mouse', 60, 'South', 'Q4'],
    ['Keyboard', 98, 'South', 'Q4'],
    ['Monitor', 350, 'South', 'Q4']
  ]

  const testHeaders = ['Product', 'Sales', 'Region', 'Quarter']

  const testAnalysis = {
    summary: "This comprehensive sales analysis reveals strong performance across all product categories and regions. The data shows consistent growth patterns with laptops being the top-performing product category, generating over $4,000 in total sales. Regional performance indicates South region outperforming North region by approximately 8%. Quarter-over-quarter analysis shows steady growth with Q4 being the strongest performing quarter.",
    insights: [
      "Laptops represent 75% of total revenue, indicating strong market demand for high-value products",
      "South region consistently outperforms North region across all quarters and product categories",
      "Q4 shows the highest sales volume, suggesting seasonal trends or year-end purchasing patterns",
      "Average sales per transaction in South region is 12% higher than North region",
      "All product categories show positive quarter-over-quarter growth"
    ],
    trends: [
      "Upward trend in laptop sales across all regions and quarters",
      "Consistent growth in accessory sales (mice and keyboards)",
      "Regional performance gap widening over time",
      "Seasonal patterns emerging with Q4 peak performance"
    ],
    recommendations: [
      "Focus marketing efforts on laptop category to maximize revenue potential",
      "Investigate North region performance to identify improvement opportunities",
      "Develop Q4-specific marketing campaigns to capitalize on seasonal trends",
      "Consider regional pricing strategies to optimize market penetration",
      "Expand accessory product lines based on growing demand trends"
    ],
    statistics: [
      {
        column: "Sales",
        count: 32,
        average: 283.75,
        min: 45,
        max: 1500,
        median: 85,
        stdDev: 428.5
      }
    ],
    patterns: [
      "Laptop sales show consistent 100+ unit performance",
      "Accessory sales maintain steady 45-100 unit range",
      "Regional performance patterns consistent across quarters",
      "Quarter-end spikes in sales volumes"
    ],
    qualityIssues: [],
    dataTypes: {
      numeric: 1,
      text: 3,
      date: 0
    }
  }

  const [showTest, setShowTest] = useState(false)

  if (!showTest) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '10px',
          padding: '40px',
          maxWidth: '600px',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ 
            color: '#333',
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '20px'
          }}>
            🧪 Export System Test
          </h1>
          
          <p style={{ 
            color: '#666',
            fontSize: '16px',
            marginBottom: '30px',
            lineHeight: '1.6'
          }}>
            Test the new client-side export system with sample data. This will demonstrate:
          </p>

          <ul style={{ 
            color: '#666',
            fontSize: '14px',
            textAlign: 'left',
            marginBottom: '30px',
            lineHeight: '1.8'
          }}>
            <li>✅ Native Chart.js export with perfect quality</li>
            <li>✅ Client-side processing (no API calls)</li>
            <li>✅ AI-powered analysis and descriptions</li>
            <li>✅ Professional PDF, Word, and PowerPoint exports</li>
            <li>✅ Real-time progress indicators</li>
            <li>✅ Enhanced chart descriptions and insights</li>
          </ul>

          <button
            onClick={() => setShowTest(true)}
            style={{
              padding: '15px 30px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              const target = e.target as HTMLButtonElement
              target.style.transform = 'translateY(-2px)'
              target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)'
            }}
            onMouseOut={(e) => {
              const target = e.target as HTMLButtonElement
              target.style.transform = 'translateY(0)'
              target.style.boxShadow = 'none'
            }}
          >
            🚀 Start Export Test
          </button>
        </div>
      </div>
    )
  }

  return (
    <DataViewer
      data={testData}
      headers={testHeaders}
      analysis={testAnalysis}
      reportName="Sales Analysis Test Report"
      companyName="ReportSonic AI"
      clientName="Test User"
      onBack={() => setShowTest(false)}
    />
  )
}
