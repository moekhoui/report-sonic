const fetch = require('node-fetch');

async function testExport() {
  try {
    console.log('🧪 Testing export API...');
    
    const response = await fetch('http://localhost:3000/api/reports/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        report: {
          name: 'test-debug.xlsx',
          analysis: {
            summary: 'Test summary for debugging',
            insights: ['Test insight 1', 'Test insight 2']
          }
        },
        rawData: [['Name', 'Value'], ['A', 1], ['B', 2]],
        headers: ['Name', 'Value'],
        format: 'pdf'
      })
    });

    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Export failed:', errorText);
      return;
    }

    const buffer = await response.buffer();
    console.log('✅ Export successful, size:', buffer.length, 'bytes');
    
    // Save the file
    const fs = require('fs');
    fs.writeFileSync('test-debug.pdf', buffer);
    console.log('💾 File saved as test-debug.pdf');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testExport();
