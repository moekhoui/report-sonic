# 🎯 Dynamic Prompt System Proposal

## Overview
Create a dynamic prompt customization system that allows users to modify AI analysis prompts before processing their data. This will provide contextual control while maintaining the core AI intelligence.

## 🎨 User Experience Flow

### 1. Upload Process
```
User uploads file → File validation → Dynamic Prompt Popup → AI Analysis → Results
```

### 2. Dynamic Prompt Popup
- **Trigger**: After successful file upload, before AI analysis
- **Design**: Beautiful modal with rich text editing capabilities
- **Purpose**: Allow users to customize analysis focus and context

## 🔧 Dynamic Attributes System

### Core Fixed Elements (Non-Editable)
These provide the foundation and ensure AI gets proper context:

```typescript
interface FixedPromptElements {
  dataStructure: {
    columns: string[]
    rowCount: number
    dataTypes: Record<string, 'string' | 'number' | 'date'>
    sampleData: any[]
  }
  analysisRequirements: {
    format: 'JSON'
    requiredSections: string[]
    maxTokens: number
  }
  technicalInstructions: {
    dataQualityCheck: boolean
    patternDetection: boolean
    statisticalAnalysis: boolean
  }
}
```

### Dynamic User-Editable Attributes

#### 1. **Business Context** 🏢
```typescript
interface BusinessContext {
  industry: {
    type: 'dropdown' | 'text'
    options: ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Education', 'Other']
    default: 'Auto-detected'
    placeholder: 'Select your industry or enter custom'
  }
  
  businessDomain: {
    type: 'dropdown' | 'text'
    options: ['Sales', 'Marketing', 'Operations', 'Finance', 'HR', 'Customer Service', 'Product', 'Other']
    default: 'Auto-detected'
    placeholder: 'What business area does this data relate to?'
  }
  
  companySize: {
    type: 'dropdown'
    options: ['Startup (1-10)', 'Small (11-50)', 'Medium (51-200)', 'Large (201-1000)', 'Enterprise (1000+)']
    default: 'Medium (51-200)'
  }
}
```

#### 2. **Analysis Focus** 🎯
```typescript
interface AnalysisFocus {
  primaryObjective: {
    type: 'radio'
    options: [
      { value: 'performance', label: 'Performance Analysis', description: 'Focus on KPIs and performance metrics' },
      { value: 'trends', label: 'Trend Analysis', description: 'Identify patterns and future predictions' },
      { value: 'comparison', label: 'Comparative Analysis', description: 'Compare segments, periods, or categories' },
      { value: 'diagnostic', label: 'Diagnostic Analysis', description: 'Find issues and root causes' },
      { value: 'strategic', label: 'Strategic Planning', description: 'Support high-level decision making' }
    ]
    default: 'performance'
  }
  
  analysisDepth: {
    type: 'slider'
    range: [1, 5]
    labels: ['Quick Overview', 'Standard Analysis', 'Detailed Analysis', 'Comprehensive Analysis', 'Expert Deep Dive']
    default: 3
  }
  
  timeHorizon: {
    type: 'dropdown'
    options: ['Historical (Past Focus)', 'Current (Present Focus)', 'Predictive (Future Focus)', 'Mixed (All Timeframes)']
    default: 'Mixed (All Timeframes)'
  }
}
```

#### 3. **Audience & Communication** 👥
```typescript
interface AudienceContext {
  targetAudience: {
    type: 'radio'
    options: [
      { value: 'executive', label: 'C-Level Executives', description: 'High-level strategic insights' },
      { value: 'management', label: 'Middle Management', description: 'Operational and tactical insights' },
      { value: 'analysts', label: 'Data Analysts', description: 'Technical and detailed analysis' },
      { value: 'stakeholders', label: 'External Stakeholders', description: 'Clear, accessible insights' }
    ]
    default: 'management'
  }
  
  communicationStyle: {
    type: 'radio'
    options: [
      { value: 'formal', label: 'Formal & Professional', description: 'Corporate, structured language' },
      { value: 'conversational', label: 'Conversational', description: 'Friendly, accessible tone' },
      { value: 'technical', label: 'Technical', description: 'Detailed, data-driven language' },
      { value: 'visual', label: 'Visual-Focused', description: 'Emphasis on charts and visualizations' }
    ]
    default: 'conversational'
  }
  
  urgency: {
    type: 'dropdown'
    options: ['Low (Comprehensive)', 'Medium (Balanced)', 'High (Quick Insights)', 'Critical (Immediate)']
    default: 'Medium (Balanced)'
  }
}
```

#### 4. **Specific Questions & Focus Areas** ❓
```typescript
interface CustomQuestions {
  keyQuestions: {
    type: 'textarea'
    placeholder: 'What specific questions do you want the AI to answer? (e.g., "Why did sales drop in Q3?", "Which products are most profitable?")'
    maxLength: 500
    rows: 3
  }
  
  focusAreas: {
    type: 'multiselect'
    options: [
      'Revenue Analysis', 'Cost Optimization', 'Customer Behavior', 'Market Trends',
      'Operational Efficiency', 'Risk Assessment', 'Growth Opportunities', 'Competitive Analysis',
      'Seasonal Patterns', 'Geographic Performance', 'Product Performance', 'Employee Metrics'
    ]
    maxSelections: 5
    default: []
  }
  
  excludeAreas: {
    type: 'multiselect'
    options: [
      'Detailed Statistics', 'Technical Methodology', 'Data Quality Issues', 'Future Predictions',
      'Competitive Analysis', 'Cost Analysis', 'Employee Data', 'Geographic Data'
    ]
    maxSelections: 3
    default: []
  }
}
```

#### 5. **Output Preferences** 📊
```typescript
interface OutputPreferences {
  reportLength: {
    type: 'radio'
    options: [
      { value: 'brief', label: 'Executive Summary (1-2 pages)', description: 'Key insights only' },
      { value: 'standard', label: 'Standard Report (3-5 pages)', description: 'Balanced detail' },
      { value: 'detailed', label: 'Detailed Report (5-10 pages)', description: 'Comprehensive analysis' },
      { value: 'comprehensive', label: 'Full Analysis (10+ pages)', description: 'Complete deep dive' }
    ]
    default: 'standard'
  }
  
  chartPreferences: {
    type: 'multiselect'
    options: ['Bar Charts', 'Line Charts', 'Pie Charts', 'Scatter Plots', 'Heatmaps', 'Gauges', 'Radar Charts']
    default: ['Bar Charts', 'Line Charts', 'Pie Charts']
  }
  
  includeRecommendations: {
    type: 'checkbox'
    label: 'Include actionable recommendations'
    default: true
  }
  
  includeRiskAnalysis: {
    type: 'checkbox'
    label: 'Include risk assessment and opportunities'
    default: true
  }
}
```

## 🎨 UI/UX Design

### Modal Layout
```
┌─────────────────────────────────────────────────────────┐
│ 🎯 Customize Your AI Analysis                    [×]    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 📋 Business Context                                     │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────┐ │
│ │ Industry        │ │ Business Domain │ │ Company Size│ │
│ │ [Dropdown ▼]    │ │ [Dropdown ▼]    │ │ [Dropdown ▼]│ │
│ └─────────────────┘ └─────────────────┘ └─────────────┘ │
│                                                         │
│ 🎯 Analysis Focus                                       │
│ ○ Performance Analysis  ○ Trend Analysis  ○ Comparison │
│ ○ Diagnostic Analysis   ○ Strategic Planning           │
│                                                         │
│ Analysis Depth: [●────○────○────○────○] Detailed       │
│                                                         │
│ 👥 Target Audience                                      │
│ ○ C-Level Executives  ○ Middle Management              │
│ ○ Data Analysts      ○ External Stakeholders           │
│                                                         │
│ 💬 Communication Style                                  │
│ ○ Formal & Professional  ○ Conversational              │
│ ○ Technical            ○ Visual-Focused                │
│                                                         │
│ ❓ Specific Questions                                   │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ What specific insights are you looking for?        │ │
│ │ (e.g., "Why did sales drop in Q3?")                │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ 📊 Output Preferences                                   │
│ Report Length: ○ Brief  ● Standard  ○ Detailed         │
│ Charts: ☑ Bar  ☑ Line  ☑ Pie  ☐ Scatter  ☐ Heatmap   │
│                                                         │
│ ┌─────────────┐ ┌─────────────┐                        │
│ │   Cancel    │ │  Analyze    │                        │
│ └─────────────┘ └─────────────┘                        │
└─────────────────────────────────────────────────────────┘
```

## 🔧 Technical Implementation

### 1. Prompt Template System
```typescript
interface PromptTemplate {
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
```

### 2. Dynamic Prompt Generation
```typescript
function generateCustomPrompt(
  userPreferences: UserPreferences,
  dataStructure: DataStructure,
  fixedElements: FixedPromptElements
): string {
  return `
${fixedElements.dataStructure}

BUSINESS CONTEXT:
- Industry: ${userPreferences.businessContext.industry}
- Domain: ${userPreferences.businessContext.businessDomain}
- Company Size: ${userPreferences.businessContext.companySize}

ANALYSIS FOCUS:
- Primary Objective: ${userPreferences.analysisFocus.primaryObjective}
- Analysis Depth: ${userPreferences.analysisFocus.analysisDepth}
- Time Horizon: ${userPreferences.analysisFocus.timeHorizon}

TARGET AUDIENCE:
- Audience: ${userPreferences.audienceContext.targetAudience}
- Communication Style: ${userPreferences.audienceContext.communicationStyle}
- Urgency: ${userPreferences.audienceContext.urgency}

SPECIFIC QUESTIONS:
${userPreferences.customQuestions.keyQuestions}

OUTPUT REQUIREMENTS:
- Report Length: ${userPreferences.outputPreferences.reportLength}
- Chart Types: ${userPreferences.outputPreferences.chartPreferences.join(', ')}
- Include Recommendations: ${userPreferences.outputPreferences.includeRecommendations}

${fixedElements.technicalInstructions}
  `.trim()
}
```

### 3. Component Structure
```typescript
// Main Modal Component
<DynamicPromptModal
  isOpen={showPromptModal}
  onClose={() => setShowPromptModal(false)}
  onAnalyze={(preferences) => handleCustomAnalysis(preferences)}
  dataStructure={detectedDataStructure}
/>

// Individual Section Components
<BusinessContextSection
  value={preferences.businessContext}
  onChange={(context) => updatePreferences('businessContext', context)}
/>

<AnalysisFocusSection
  value={preferences.analysisFocus}
  onChange={(focus) => updatePreferences('analysisFocus', focus)}
/>

<AudienceContextSection
  value={preferences.audienceContext}
  onChange={(audience) => updatePreferences('audienceContext', audience)}
/>

<CustomQuestionsSection
  value={preferences.customQuestions}
  onChange={(questions) => updatePreferences('customQuestions', questions)}
/>

<OutputPreferencesSection
  value={preferences.outputPreferences}
  onChange={(output) => updatePreferences('outputPreferences', output)}
/>
```

## 🎯 Benefits

### For Users
- **Personalized Analysis**: Get insights tailored to their specific needs
- **Contextual Control**: Guide AI focus without losing intelligence
- **Professional Output**: Reports match their communication style
- **Efficiency**: Skip irrelevant analysis sections

### For the Platform
- **User Engagement**: Interactive customization increases engagement
- **Quality Control**: Users guide AI toward relevant insights
- **Differentiation**: Unique feature that competitors don't have
- **User Retention**: Personalized experience increases satisfaction

## 🚀 Implementation Phases

### Phase 1: Core System
- Basic modal with essential attributes
- Business context and analysis focus
- Simple prompt generation

### Phase 2: Enhanced Features
- Advanced audience targeting
- Custom questions system
- Output preferences

### Phase 3: Advanced Customization
- Rich text editing for custom sections
- Template saving and sharing
- Advanced chart preferences

## 💡 Example Usage Scenarios

### Scenario 1: Executive Dashboard
```
Industry: Technology
Domain: Sales
Audience: C-Level Executives
Focus: Strategic Planning
Style: Formal & Professional
Questions: "What are our growth opportunities?"
Output: Executive Summary with key metrics
```

### Scenario 2: Operational Analysis
```
Industry: Manufacturing
Domain: Operations
Audience: Middle Management
Focus: Diagnostic Analysis
Style: Technical
Questions: "Why is production efficiency declining?"
Output: Detailed report with root cause analysis
```

### Scenario 3: Marketing Campaign
```
Industry: Retail
Domain: Marketing
Audience: External Stakeholders
Focus: Performance Analysis
Style: Visual-Focused
Questions: "Which campaigns performed best?"
Output: Visual-heavy report with recommendations
```

This dynamic prompt system provides the perfect balance between AI intelligence and user control, ensuring every analysis is both comprehensive and relevant to the user's specific needs.
