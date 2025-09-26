// Enhanced data generation functions that work with any data structure
// Includes support for qualitative data analysis (scoping, surveys, etc.)

// Helper function to detect qualitative data patterns
function detectQualitativeData(data: any[], columns: string[]): {
  hasQualitativeData: boolean
  qualitativeColumns: string[]
  categoricalColumns: string[]
  textColumns: string[]
  ratingColumns: string[]
  scaleColumns: string[]
} {
  const qualitativeColumns: string[] = []
  const categoricalColumns: string[] = []
  const textColumns: string[] = []
  const ratingColumns: string[] = []
  const scaleColumns: string[] = []

  for (const col of columns) {
    const values = data.map(row => row[col]).filter(val => val !== null && val !== undefined && val !== '')
    
    if (values.length === 0) continue

    const uniqueValues = new Set(values)
    const sampleValue = values[0]

    // Check for rating scales (1-5, 1-10, etc.)
    if (typeof sampleValue === 'string' && /^[1-9]|10$/.test(sampleValue.trim())) {
      const numericValues = values.map(v => parseInt(v)).filter(v => !isNaN(v) && v >= 1 && v <= 10)
      if (numericValues.length > values.length * 0.8) {
        ratingColumns.push(col)
        continue
      }
    }

    // Check for Likert scales (Strongly Agree, Agree, etc.)
    if (typeof sampleValue === 'string') {
      const likertTerms = ['strongly agree', 'agree', 'neutral', 'disagree', 'strongly disagree', 'very satisfied', 'satisfied', 'dissatisfied', 'very dissatisfied']
      const hasLikertTerms = values.some(v => likertTerms.some(term => v.toLowerCase().includes(term)))
      if (hasLikertTerms) {
        scaleColumns.push(col)
        continue
      }
    }

    // Check for categorical data (limited unique values)
    if (uniqueValues.size < 20 && uniqueValues.size > 1) {
      categoricalColumns.push(col)
    }

    // Check for text data (longer text responses)
    if (typeof sampleValue === 'string' && sampleValue.length > 10) {
      textColumns.push(col)
    }
  }

  qualitativeColumns.push(...categoricalColumns, ...textColumns, ...ratingColumns, ...scaleColumns)

  return {
    hasQualitativeData: qualitativeColumns.length > 0,
    qualitativeColumns,
    categoricalColumns,
    textColumns,
    ratingColumns,
    scaleColumns
  }
}

export function generateBarChartData(data: any[], analysis: any): any[] {
  // Enhanced data detection with qualitative support
  const columns = Object.keys(data[0] || {})
  const qualitativeData = detectQualitativeData(data, columns)
  
  // Find categorical column (string with limited unique values)
  let categoricalCol: string | null = null
  let numericCol: string | null = null
  
  // Prioritize qualitative data for better visualization
  if (qualitativeData.hasQualitativeData) {
    // Use qualitative columns for better categorical representation
    categoricalCol = qualitativeData.categoricalColumns[0] || qualitativeData.ratingColumns[0] || qualitativeData.scaleColumns[0]
  }
  
  for (const col of columns) {
    const values = data.map(row => row[col]).filter(val => val !== null && val !== undefined && val !== '')
    const uniqueValues = new Set(values)
    
    // Check if it's categorical (string with limited unique values)
    if (!categoricalCol && values.length > 0 && typeof values[0] === 'string' && uniqueValues.size < 10 && uniqueValues.size > 1) {
      categoricalCol = col
    }
    
    // Check if it's numeric
    if (values.length > 0 && !isNaN(parseFloat(values[0]))) {
      numericCol = col
    }
  }

  if (!categoricalCol) {
    // Generate sample bar chart data with qualitative examples
    return [
      { name: 'Very Satisfied', value: 45 },
      { name: 'Satisfied', value: 32 },
      { name: 'Neutral', value: 28 },
      { name: 'Dissatisfied', value: 19 },
      { name: 'Very Dissatisfied', value: 15 }
    ]
  }

  if (!numericCol) {
    // Count occurrences for qualitative data
    const grouped = data.reduce((acc, row) => {
      const key = row[categoricalCol!]
      if (key) {
        acc[key] = (acc[key] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    return Object.entries(grouped).map(([name, value]) => ({ name, value }))
  }

  const grouped = data.reduce((acc, row) => {
    const key = row[categoricalCol!]
    acc[key] = (acc[key] || 0) + (parseFloat(row[numericCol!]) || 0)
    return acc
  }, {} as Record<string, number>)

  return Object.entries(grouped).map(([name, value]) => ({ name, value }))
}

export function generateLineChartData(data: any[], analysis: any): any[] {
  // Enhanced data detection with fallback
  const columns = Object.keys(data[0] || {})
  
  // Find date column
  let dateCol: string | null = null
  let numericCol: string | null = null
  
  for (const col of columns) {
    const values = data.map(row => row[col]).filter(val => val !== null && val !== undefined && val !== '')
    
    // Check if it's a date column
    if (values.length > 0) {
      const sampleValue = values[0]
      const date = new Date(sampleValue)
      if (!isNaN(date.getTime()) || /^\d{4}-\d{2}-\d{2}/.test(sampleValue) || /^\d{2}\/\d{2}\/\d{4}/.test(sampleValue)) {
        dateCol = col
      }
    }
    
    // Check if it's numeric
    if (values.length > 0 && !isNaN(parseFloat(values[0]))) {
      numericCol = col
    }
  }

  // If we have actual date data, use it
  if (dateCol && numericCol) {
    const validData = data
      .filter(row => row[dateCol!] && row[numericCol!] && !isNaN(new Date(row[dateCol!]).getTime()))
      .sort((a, b) => new Date(a[dateCol!]).getTime() - new Date(b[dateCol!]).getTime())
    
    if (validData.length > 0) {
      return validData.map(row => ({
        name: new Date(row[dateCol!]).toLocaleDateString(),
        value: parseFloat(row[numericCol!]) || 0
      }))
    }
  }

  // If no date data or invalid dates, generate sequential data
  if (numericCol) {
    return data.slice(0, 12).map((row, index) => ({
      name: `Period ${index + 1}`,
      value: parseFloat(row[numericCol!]) || Math.random() * 100
    }))
  }

  // Fallback sample data
  return [
    { name: 'Period 1', value: 20 },
    { name: 'Period 2', value: 35 },
    { name: 'Period 3', value: 28 },
    { name: 'Period 4', value: 42 },
    { name: 'Period 5', value: 38 },
    { name: 'Period 6', value: 55 }
  ]
}

export function generatePieChartData(data: any[], analysis: any): any[] {
  // Enhanced data detection with fallback
  const columns = Object.keys(data[0] || {})
  
  // Find categorical column (string with limited unique values)
  let categoricalCol: string | null = null
  
  for (const col of columns) {
    const values = data.map(row => row[col]).filter(val => val !== null && val !== undefined && val !== '')
    const uniqueValues = new Set(values)
    
    // Check if it's categorical (string with limited unique values)
    if (values.length > 0 && typeof values[0] === 'string' && uniqueValues.size < 8 && uniqueValues.size > 1) {
      categoricalCol = col
      break
    }
  }

  if (!categoricalCol) {
    // Generate sample pie chart data
    return [
      { name: 'Desktop', value: 45 },
      { name: 'Mobile', value: 35 },
      { name: 'Tablet', value: 20 }
    ]
  }

  // Count occurrences of each category
  const counts = data.reduce((acc, row) => {
    const category = row[categoricalCol!] || 'Unknown'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(counts).map(([name, value]) => ({ name, value }))
}

export function generateDoughnutChartData(data: any[], analysis: any): any[] {
  // Enhanced data detection with fallback
  const columns = Object.keys(data[0] || {})
  
  // Find categorical column (string with limited unique values)
  let categoricalCol: string | null = null
  
  for (const col of columns) {
    const values = data.map(row => row[col]).filter(val => val !== null && val !== undefined && val !== '')
    const uniqueValues = new Set(values)
    
    // Check if it's categorical (string with limited unique values)
    if (values.length > 0 && typeof values[0] === 'string' && uniqueValues.size < 6 && uniqueValues.size > 1) {
      categoricalCol = col
      break
    }
  }

  if (!categoricalCol) {
    // Generate sample doughnut chart data
    return [
      { name: 'Revenue', value: 60 },
      { name: 'Costs', value: 25 },
      { name: 'Profit', value: 15 }
    ]
  }

  const grouped = data.reduce((acc, row) => {
    const key = row[categoricalCol!]
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(grouped).map(([name, value]) => ({ name, value }))
}

export function generateScatterPlotData(data: any[], analysis: any): any[] {
  // Enhanced data detection with fallback
  const columns = Object.keys(data[0] || {})
  const numericCols = columns.filter(col => {
    const values = data.map(row => row[col]).filter(val => val !== null && val !== undefined && val !== '')
    return values.length > 0 && !isNaN(parseFloat(values[0]))
  })
  
  if (numericCols.length < 2) {
    // Generate sample scatter plot data
    return [
      { x: 10, y: 20, r: 5 },
      { x: 15, y: 35, r: 8 },
      { x: 20, y: 25, r: 6 },
      { x: 25, y: 45, r: 10 },
      { x: 30, y: 30, r: 7 },
      { x: 35, y: 55, r: 12 },
      { x: 40, y: 40, r: 9 },
      { x: 45, y: 65, r: 11 }
    ]
  }

  return data.map(row => ({
    x: parseFloat(row[numericCols[0]!]) || 0,
    y: parseFloat(row[numericCols[1]!]) || 0,
    r: Math.random() * 10 + 5
  }))
}

export function generateRadarChartData(data: any[], analysis: any): any[] {
  // Enhanced data detection with fallback
  const columns = Object.keys(data[0] || {})
  const numericCols = columns.filter(col => {
    const values = data.map(row => row[col]).filter(val => val !== null && val !== undefined && val !== '')
    return values.length > 0 && !isNaN(parseFloat(values[0]))
  }).slice(0, 6)
  
  if (numericCols.length < 3) {
    // Generate sample radar chart data
    return [
      { name: 'Performance', value: 85 },
      { name: 'Quality', value: 92 },
      { name: 'Speed', value: 78 },
      { name: 'Reliability', value: 88 },
      { name: 'Innovation', value: 75 },
      { name: 'Support', value: 90 }
    ]
  }

  const avgValues = numericCols.map((col: string) => {
    const values = data.map(row => parseFloat(row[col]!) || 0).filter(val => !isNaN(val))
    return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0
  })

  return numericCols.map((col: string, index: number) => ({
    name: col,
    value: avgValues[index]
  }))
}

export function generateGaugeChartData(data: any[], analysis: any): any[] {
  // Enhanced data detection with fallback
  const columns = Object.keys(data[0] || {})
  const numericCols = columns.filter(col => {
    const values = data.map(row => row[col]).filter(val => val !== null && val !== undefined && val !== '')
    return values.length > 0 && !isNaN(parseFloat(values[0]))
  })
  
  if (numericCols.length === 0) {
    // Generate sample gauge chart data
    return [{
      value: 75,
      max: 100,
      label: 'Performance Score'
    }]
  }

  // Calculate average of first numeric column
  const values = data.map(row => parseFloat(row[numericCols[0]!]) || 0).filter(val => !isNaN(val))
  const avg = values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0
  const max = values.length > 0 ? Math.max(...values) : 100

  return [{
    value: Math.round(avg),
    max: Math.max(max, 100),
    label: `${numericCols[0]!} Average`
  }]
}

// New function for qualitative data analysis (surveys, scoping, etc.)
export function generateQualitativeChartData(data: any[], analysis: any): any[] {
  const columns = Object.keys(data[0] || {})
  const qualitativeData = detectQualitativeData(data, columns)
  
  if (!qualitativeData.hasQualitativeData) {
    // Generate sample qualitative data
    return [
      { name: 'Strongly Agree', value: 25 },
      { name: 'Agree', value: 35 },
      { name: 'Neutral', value: 20 },
      { name: 'Disagree', value: 15 },
      { name: 'Strongly Disagree', value: 5 }
    ]
  }

  // Use the first qualitative column for visualization
  const qualitativeCol = qualitativeData.qualitativeColumns[0]
  const values = data.map(row => row[qualitativeCol]).filter(val => val !== null && val !== undefined && val !== '')
  
  // Count occurrences
  const grouped = values.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(grouped)
    .sort(([,a], [,b]) => (b as number) - (a as number)) // Sort by count descending
    .map(([name, value]) => ({ name, value }))
}

// Function for rating scale visualization
export function generateRatingChartData(data: any[], analysis: any): any[] {
  const columns = Object.keys(data[0] || {})
  const qualitativeData = detectQualitativeData(data, columns)
  
  if (qualitativeData.ratingColumns.length === 0) {
    // Generate sample rating data
    return [
      { name: '1', value: 5 },
      { name: '2', value: 8 },
      { name: '3', value: 15 },
      { name: '4', value: 25 },
      { name: '5', value: 35 },
      { name: '6', value: 20 },
      { name: '7', value: 18 },
      { name: '8', value: 12 },
      { name: '9', value: 8 },
      { name: '10', value: 4 }
    ]
  }

  const ratingCol = qualitativeData.ratingColumns[0]
  const values = data.map(row => row[ratingCol]).filter(val => val !== null && val !== undefined && val !== '')
  
  // Count occurrences for each rating
  const grouped = values.reduce((acc, value) => {
    const rating = parseInt(value.toString())
    if (!isNaN(rating) && rating >= 1 && rating <= 10) {
      acc[rating] = (acc[rating] || 0) + 1
    }
    return acc
  }, {} as Record<number, number>)

  // Fill in missing ratings with 0
  const result = []
  for (let i = 1; i <= 10; i++) {
    result.push({ name: i.toString(), value: grouped[i] || 0 })
  }

  return result
}
