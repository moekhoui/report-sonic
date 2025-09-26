import { UserPreferences, DataStructure, FixedPromptElements } from '../types/dynamic-prompt'

export function generateCustomPrompt(
  userPreferences: UserPreferences,
  dataStructure: DataStructure,
  fixedElements: FixedPromptElements
): string {
  const businessContext = generateBusinessContextSection(userPreferences.businessContext)
  const analysisFocus = generateAnalysisFocusSection(userPreferences.analysisFocus)
  const audienceContext = generateAudienceContextSection(userPreferences.audienceContext)
  const customQuestions = generateCustomQuestionsSection(userPreferences.customQuestions)
  const outputPreferences = generateOutputPreferencesSection(userPreferences.outputPreferences)
  const dataStructureSection = generateDataStructureSection(dataStructure)
  const technicalRequirements = generateTechnicalRequirementsSection(fixedElements.analysisRequirements)
  const formatInstructions = generateFormatInstructionsSection(fixedElements.technicalInstructions)

  return `
COMPREHENSIVE DATASET ANALYSIS REQUEST

${dataStructureSection}

${businessContext}

${analysisFocus}

${audienceContext}

${customQuestions}

${outputPreferences}

${technicalRequirements}

${formatInstructions}

CRITICAL INSTRUCTIONS: 
- Analyze ALL columns and rows, including empty ones
- Use industry-specific terminology and standards
- Address the target audience appropriately
- Focus on the specified analysis type
- Provide specific, actionable insights with quantitative evidence
- Include data completeness percentages for each column
- Identify relationships between different data columns
- Consider seasonal patterns if date columns exist
- Highlight data quality issues with specific recommendations
- Provide business context for all findings
- Follow the specified communication style
- Meet the urgency requirements
- Include only the requested chart types
- Provide the appropriate level of detail for the report length
  `.trim()
}

function generateBusinessContextSection(businessContext: UserPreferences['businessContext']): string {
  return `
BUSINESS CONTEXT:
- Industry: ${businessContext.industry.value}
- Business Domain: ${businessContext.businessDomain.value}
- Company Size: ${businessContext.companySize.value}

Use ${businessContext.industry.value} industry terminology and standards. Focus on ${businessContext.businessDomain.value} domain-specific insights. Provide recommendations appropriate for ${businessContext.companySize.value} companies.
  `.trim()
}

function generateAnalysisFocusSection(analysisFocus: UserPreferences['analysisFocus']): string {
  const depthLabels = ['Quick Overview', 'Standard Analysis', 'Detailed Analysis', 'Comprehensive Analysis', 'Expert Deep Dive']
  const selectedDepth = depthLabels[analysisFocus.analysisDepth.value - 1]
  
  const objectiveDescriptions = {
    performance: 'Focus on KPIs, performance metrics, and operational efficiency',
    trends: 'Identify patterns, trends, and future predictions',
    comparison: 'Compare segments, periods, categories, and benchmarks',
    diagnostic: 'Find issues, root causes, and problem areas',
    strategic: 'Support high-level decision making and strategic planning'
  }

  return `
ANALYSIS FOCUS:
- Primary Objective: ${analysisFocus.primaryObjective.value} - ${objectiveDescriptions[analysisFocus.primaryObjective.value as keyof typeof objectiveDescriptions]}
- Analysis Depth: ${selectedDepth}
- Time Horizon: ${analysisFocus.timeHorizon.value}

Provide ${selectedDepth.toLowerCase()} with ${analysisFocus.timeHorizon.value.toLowerCase()} perspective. Focus on ${objectiveDescriptions[analysisFocus.primaryObjective.value as keyof typeof objectiveDescriptions]}.
  `.trim()
}

function generateAudienceContextSection(audienceContext: UserPreferences['audienceContext']): string {
  const audienceDescriptions = {
    executive: 'C-level executives requiring high-level strategic insights and executive summaries',
    management: 'Middle management needing operational and tactical insights for decision making',
    analysts: 'Data analysts requiring technical details, methodology, and statistical analysis',
    stakeholders: 'External stakeholders needing clear, accessible insights and business impact'
  }

  const styleDescriptions = {
    formal: 'Use formal, professional language with corporate terminology',
    conversational: 'Use friendly, accessible tone with clear explanations',
    technical: 'Use detailed, data-driven language with statistical terminology',
    visual: 'Emphasize charts, visualizations, and graphical representations'
  }

  const urgencyDescriptions = {
    'Low (Comprehensive)': 'Provide comprehensive, thorough analysis with extensive detail',
    'Medium (Balanced)': 'Provide balanced analysis with key insights and supporting detail',
    'High (Quick Insights)': 'Focus on quick, actionable insights with essential information only',
    'Critical (Immediate)': 'Provide immediate, critical insights with urgent recommendations'
  }

  return `
TARGET AUDIENCE & COMMUNICATION:
- Audience: ${audienceContext.targetAudience.value} - ${audienceDescriptions[audienceContext.targetAudience.value as keyof typeof audienceDescriptions]}
- Communication Style: ${audienceContext.communicationStyle.value} - ${styleDescriptions[audienceContext.communicationStyle.value as keyof typeof styleDescriptions]}
- Urgency: ${audienceContext.urgency.value} - ${urgencyDescriptions[audienceContext.urgency.value as keyof typeof urgencyDescriptions]}

Tailor the analysis for ${audienceContext.targetAudience.value}. Use ${audienceContext.communicationStyle.value} communication style. ${urgencyDescriptions[audienceContext.urgency.value as keyof typeof urgencyDescriptions]}.
  `.trim()
}

function generateCustomQuestionsSection(customQuestions: UserPreferences['customQuestions']): string {
  let section = 'CUSTOM QUESTIONS & FOCUS:\n'
  
  if (customQuestions.keyQuestions.value.trim()) {
    section += `- Specific Questions: ${customQuestions.keyQuestions.value}\n`
  }
  
  if (customQuestions.focusAreas.value.length > 0) {
    section += `- Focus Areas: ${customQuestions.focusAreas.value.join(', ')}\n`
  }
  
  if (customQuestions.excludeAreas.value.length > 0) {
    section += `- Exclude Areas: ${customQuestions.excludeAreas.value.join(', ')}\n`
  }
  
  if (!customQuestions.keyQuestions.value.trim() && customQuestions.focusAreas.value.length === 0 && customQuestions.excludeAreas.value.length === 0) {
    section += '- No specific questions or focus areas provided - provide comprehensive analysis\n'
  }
  
  return section.trim()
}

function generateOutputPreferencesSection(outputPreferences: UserPreferences['outputPreferences']): string {
  const lengthDescriptions = {
    brief: 'Executive Summary format - key insights only (1-2 pages)',
    standard: 'Standard Report format - balanced detail (3-5 pages)',
    detailed: 'Detailed Report format - comprehensive analysis (5-10 pages)',
    comprehensive: 'Full Analysis format - complete deep dive (10+ pages)'
  }

  let section = `
OUTPUT REQUIREMENTS:
- Report Length: ${outputPreferences.reportLength.value} - ${lengthDescriptions[outputPreferences.reportLength.value as keyof typeof lengthDescriptions]}
- Chart Types: ${outputPreferences.chartPreferences.value.length > 0 ? outputPreferences.chartPreferences.value.join(', ') : 'All available types'}
- Include Recommendations: ${outputPreferences.includeRecommendations.value ? 'Yes' : 'No'}
- Include Risk Analysis: ${outputPreferences.includeRiskAnalysis.value ? 'Yes' : 'No'}
  `.trim()

  if (outputPreferences.chartPreferences.value.length > 0) {
    section += `\n\nFocus on these chart types: ${outputPreferences.chartPreferences.value.join(', ')}. Avoid other chart types unless specifically relevant.`
  }

  return section
}

function generateDataStructureSection(dataStructure: DataStructure): string {
  const numericCols = Object.keys(dataStructure.dataTypes).filter(k => dataStructure.dataTypes[k] === 'number')
  const textCols = Object.keys(dataStructure.dataTypes).filter(k => dataStructure.dataTypes[k] === 'string')
  const dateCols = Object.keys(dataStructure.dataTypes).filter(k => dataStructure.dataTypes[k] === 'date')

  return `
DATASET INFORMATION:
- Columns: ${dataStructure.columns.join(', ')}
- Total Rows: ${dataStructure.rowCount}
- Numeric Columns: ${numericCols.length} (${numericCols.join(', ')})
- Text/Categorical Columns: ${textCols.length} (${textCols.join(', ')})
- Date Columns: ${dateCols.length} (${dateCols.join(', ')})
- Sample Data: ${JSON.stringify(dataStructure.sampleData.slice(0, 5), null, 2)}
  `.trim()
}

function generateTechnicalRequirementsSection(analysisRequirements: FixedPromptElements['analysisRequirements']): string {
  return `
TECHNICAL REQUIREMENTS:
- Format: ${analysisRequirements.format}
- Required Sections: ${analysisRequirements.requiredSections.join(', ')}
- Max Tokens: ${analysisRequirements.maxTokens}
- Data Quality Check: Required
- Pattern Detection: Required
- Statistical Analysis: Required
  `.trim()
}

function generateFormatInstructionsSection(technicalInstructions: FixedPromptElements['technicalInstructions']): string {
  return `
FORMAT INSTRUCTIONS:
Return as JSON with these exact keys: summary, insights, trends, qualityIssues, recommendations, statistics, businessApplications, riskOpportunities, nextSteps, dataRelationships

Ensure all sections are populated with relevant, actionable content based on the data analysis and user preferences.
  `.trim()
}

// Helper function to detect data structure from raw data
export function detectDataStructure(data: any[]): DataStructure {
  if (!data || data.length === 0) {
    return {
      columns: [],
      rowCount: 0,
      dataTypes: {},
      sampleData: []
    }
  }

  const columns = Object.keys(data[0] || {})
  const dataTypes: Record<string, 'string' | 'number' | 'date'> = {}
  
  // Analyze each column to determine data type
  columns.forEach(column => {
    const values = data.map(row => row[column]).filter(val => val !== null && val !== undefined && val !== '')
    
    if (values.length === 0) {
      dataTypes[column] = 'string'
      return
    }

    // Check if it's numeric
    const numericValues = values.filter(val => !isNaN(parseFloat(val)))
    if (numericValues.length / values.length > 0.8) {
      dataTypes[column] = 'number'
      return
    }

    // Check if it's a date
    const dateValues = values.filter(val => {
      const date = new Date(val)
      return !isNaN(date.getTime()) || 
             /^\d{4}-\d{2}-\d{2}/.test(val) ||
             /^\d{2}\/\d{2}\/\d{4}/.test(val)
    })
    if (dateValues.length / values.length > 0.8) {
      dataTypes[column] = 'date'
      return
    }

    // Default to string
    dataTypes[column] = 'string'
  })

  return {
    columns,
    rowCount: data.length,
    dataTypes,
    sampleData: data.slice(0, 10)
  }
}

