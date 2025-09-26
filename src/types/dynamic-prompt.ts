// Dynamic Prompt System Types and Interfaces

export interface BusinessContext {
  industry: {
    type: 'dropdown' | 'text'
    value: string
    options: string[]
    placeholder: string
  }
  businessDomain: {
    type: 'dropdown' | 'text'
    value: string
    options: string[]
    placeholder: string
  }
  companySize: {
    type: 'dropdown'
    value: string
    options: string[]
  }
}

export interface AnalysisFocus {
  primaryObjective: {
    type: 'radio'
    value: string
    options: Array<{
      value: string
      label: string
      description: string
    }>
  }
  analysisDepth: {
    type: 'slider'
    value: number
    range: [number, number]
    labels: string[]
  }
  timeHorizon: {
    type: 'dropdown'
    value: string
    options: string[]
  }
}

export interface AudienceContext {
  targetAudience: {
    type: 'radio'
    value: string
    options: Array<{
      value: string
      label: string
      description: string
    }>
  }
  communicationStyle: {
    type: 'radio'
    value: string
    options: Array<{
      value: string
      label: string
      description: string
    }>
  }
  urgency: {
    type: 'dropdown'
    value: string
    options: string[]
  }
}

export interface CustomQuestions {
  keyQuestions: {
    type: 'textarea'
    value: string
    placeholder: string
    maxLength: number
    rows: number
  }
  focusAreas: {
    type: 'multiselect'
    value: string[]
    options: string[]
    maxSelections: number
  }
  excludeAreas: {
    type: 'multiselect'
    value: string[]
    options: string[]
    maxSelections: number
  }
}

export interface OutputPreferences {
  reportLength: {
    type: 'radio'
    value: string
    options: Array<{
      value: string
      label: string
      description: string
    }>
  }
  chartPreferences: {
    type: 'multiselect'
    value: string[]
    options: string[]
  }
  includeRecommendations: {
    type: 'checkbox'
    value: boolean
    label: string
  }
  includeRiskAnalysis: {
    type: 'checkbox'
    value: boolean
    label: string
  }
}

export interface UserPreferences {
  businessContext: BusinessContext
  analysisFocus: AnalysisFocus
  audienceContext: AudienceContext
  customQuestions: CustomQuestions
  outputPreferences: OutputPreferences
}

export interface DataStructure {
  columns: string[]
  rowCount: number
  dataTypes: Record<string, 'string' | 'number' | 'date'>
  sampleData: any[]
}

export interface FixedPromptElements {
  dataStructure: DataStructure
  analysisRequirements: {
    format: string
    requiredSections: string[]
    maxTokens: number
  }
  technicalInstructions: {
    dataQualityCheck: boolean
    patternDetection: boolean
    statisticalAnalysis: boolean
  }
}

export interface PromptTemplate {
  baseTemplate: string
  dynamicSections: {
    businessContext: string
    analysisFocus: string
    audienceContext: string
    customQuestions: string
    outputPreferences: string
  }
  fixedSections: {
    dataStructure: string
    technicalRequirements: string
    formatInstructions: string
  }
}

// Default values for the dynamic prompt system
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  businessContext: {
    industry: {
      type: 'dropdown',
      value: 'Auto-detected',
      options: ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Education', 'Other'],
      placeholder: 'Select your industry or enter custom'
    },
    businessDomain: {
      type: 'dropdown',
      value: 'Auto-detected',
      options: ['Sales', 'Marketing', 'Operations', 'Finance', 'HR', 'Customer Service', 'Product', 'Other'],
      placeholder: 'What business area does this data relate to?'
    },
    companySize: {
      type: 'dropdown',
      value: 'Medium (51-200)',
      options: ['Startup (1-10)', 'Small (11-50)', 'Medium (51-200)', 'Large (201-1000)', 'Enterprise (1000+)']
    }
  },
  analysisFocus: {
    primaryObjective: {
      type: 'radio',
      value: 'performance',
      options: [
        { value: 'performance', label: 'Performance Analysis', description: 'Focus on KPIs and performance metrics' },
        { value: 'trends', label: 'Trend Analysis', description: 'Identify patterns and future predictions' },
        { value: 'comparison', label: 'Comparative Analysis', description: 'Compare segments, periods, or categories' },
        { value: 'diagnostic', label: 'Diagnostic Analysis', description: 'Find issues and root causes' },
        { value: 'strategic', label: 'Strategic Planning', description: 'Support high-level decision making' }
      ]
    },
    analysisDepth: {
      type: 'slider',
      value: 3,
      range: [1, 5],
      labels: ['Quick Overview', 'Standard Analysis', 'Detailed Analysis', 'Comprehensive Analysis', 'Expert Deep Dive']
    },
    timeHorizon: {
      type: 'dropdown',
      value: 'Mixed (All Timeframes)',
      options: ['Historical (Past Focus)', 'Current (Present Focus)', 'Predictive (Future Focus)', 'Mixed (All Timeframes)']
    }
  },
  audienceContext: {
    targetAudience: {
      type: 'radio',
      value: 'management',
      options: [
        { value: 'executive', label: 'C-Level Executives', description: 'High-level strategic insights' },
        { value: 'management', label: 'Middle Management', description: 'Operational and tactical insights' },
        { value: 'analysts', label: 'Data Analysts', description: 'Technical and detailed analysis' },
        { value: 'stakeholders', label: 'External Stakeholders', description: 'Clear, accessible insights' }
      ]
    },
    communicationStyle: {
      type: 'radio',
      value: 'conversational',
      options: [
        { value: 'formal', label: 'Formal & Professional', description: 'Corporate, structured language' },
        { value: 'conversational', label: 'Conversational', description: 'Friendly, accessible tone' },
        { value: 'technical', label: 'Technical', description: 'Detailed, data-driven language' },
        { value: 'visual', label: 'Visual-Focused', description: 'Emphasis on charts and visualizations' }
      ]
    },
    urgency: {
      type: 'dropdown',
      value: 'Medium (Balanced)',
      options: ['Low (Comprehensive)', 'Medium (Balanced)', 'High (Quick Insights)', 'Critical (Immediate)']
    }
  },
  customQuestions: {
    keyQuestions: {
      type: 'textarea',
      value: '',
      placeholder: 'What specific questions do you want the AI to answer? (e.g., "Why did sales drop in Q3?", "Which products are most profitable?")',
      maxLength: 500,
      rows: 3
    },
    focusAreas: {
      type: 'multiselect',
      value: [],
      options: [
        'Revenue Analysis', 'Cost Optimization', 'Customer Behavior', 'Market Trends',
        'Operational Efficiency', 'Risk Assessment', 'Growth Opportunities', 'Competitive Analysis',
        'Seasonal Patterns', 'Geographic Performance', 'Product Performance', 'Employee Metrics'
      ],
      maxSelections: 5
    },
    excludeAreas: {
      type: 'multiselect',
      value: [],
      options: [
        'Detailed Statistics', 'Technical Methodology', 'Data Quality Issues', 'Future Predictions',
        'Competitive Analysis', 'Cost Analysis', 'Employee Data', 'Geographic Data'
      ],
      maxSelections: 3
    }
  },
  outputPreferences: {
    reportLength: {
      type: 'radio',
      value: 'standard',
      options: [
        { value: 'brief', label: 'Executive Summary (1-2 pages)', description: 'Key insights only' },
        { value: 'standard', label: 'Standard Report (3-5 pages)', description: 'Balanced detail' },
        { value: 'detailed', label: 'Detailed Report (5-10 pages)', description: 'Comprehensive analysis' },
        { value: 'comprehensive', label: 'Full Analysis (10+ pages)', description: 'Complete deep dive' }
      ]
    },
    chartPreferences: {
      type: 'multiselect',
      value: ['Bar Charts', 'Line Charts', 'Pie Charts'],
      options: ['Bar Charts', 'Line Charts', 'Pie Charts', 'Scatter Plots', 'Heatmaps', 'Gauges', 'Radar Charts']
    },
    includeRecommendations: {
      type: 'checkbox',
      value: true,
      label: 'Include actionable recommendations'
    },
    includeRiskAnalysis: {
      type: 'checkbox',
      value: true,
      label: 'Include risk assessment and opportunities'
    }
  }
}

