const { AIChartGenerator } = require('./src/lib/chartGenerator')

async function testChartGeneration() {
  console.log('🧪 Testing Chart Generation...')
  
  try {
    const chartGenerator = new AIChartGenerator()
    
    // Test data
    const testData = [
      ['Name', 'Age', 'Score'],
      ['John', 25, 85],
      ['Jane', 30, 92],
      ['Bob', 35, 78],
      ['Alice', 28, 95],
      ['Charlie', 32, 88]
    ]
    
    const headers = testData[0]
    const dataRows = testData.slice(1)
    
    console.log('📊 Headers:', headers)
    console.log('📊 Data rows:', dataRows.length)
    
    const results = await chartGenerator.generateMultiChartAnalysis(dataRows, headers, 3)
    
    console.log('✅ Chart generation results:')
    console.log('📊 Number of charts:', results.length)
    
    results.forEach((result, index) => {
      console.log(`\n📈 Chart ${index + 1}:`)
      console.log('  Title:', result.config.title)
      console.log('  Type:', result.config.type)
      console.log('  Has image:', !!result.image)
      console.log('  Image length:', result.image ? result.image.length : 0)
      console.log('  Insights length:', result.insights ? result.insights.length : 0)
    })
    
  } catch (error) {
    console.error('❌ Chart generation failed:', error)
    console.error('Stack:', error.stack)
  }
}

testChartGeneration()
