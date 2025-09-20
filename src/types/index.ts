export interface User {
  id: string
  email: string
  name: string
  image?: string
  subscription?: Subscription
  createdAt: Date
  updatedAt: Date
}

export interface Subscription {
  id: string
  userId: string
  plan: 'free' | 'pro' | 'enterprise'
  status: 'active' | 'canceled' | 'past_due'
  stripeCustomerId: string
  stripeSubscriptionId?: string
  currentPeriodEnd: Date
  createdAt: Date
  updatedAt: Date
}

export interface Report {
  id: string
  userId: string
  title: string
  description?: string
  data: any[]
  template: ReportTemplate
  branding: BrandingSettings
  status: 'draft' | 'generating' | 'completed' | 'failed'
  aiInsights?: AIInsights
  charts?: Chart[]
  createdAt: Date
  updatedAt: Date
}

export interface ReportTemplate {
  id: string
  name: string
  description: string
  layout: string
  sections: TemplateSection[]
  isPremium: boolean
}

export interface TemplateSection {
  id: string
  type: 'executive_summary' | 'data_analysis' | 'charts' | 'recommendations' | 'custom'
  title: string
  order: number
  required: boolean
}

export interface BrandingSettings {
  logo?: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  companyName: string
  clientName?: string
}

export interface AIInsights {
  summary: string
  keyFindings: string[]
  recommendations: string[]
  dataQuality: {
    completeness: number
    accuracy: number
    consistency: number
  }
}

export interface Chart {
  id: string
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'area'
  title: string
  data: any[]
  config: ChartConfig
}

export interface ChartConfig {
  xAxis?: string
  yAxis?: string
  colors?: string[]
  showLegend?: boolean
  showGrid?: boolean
}

export interface DataSource {
  id: string
  userId: string
  name: string
  type: 'csv' | 'google_sheets' | 'api'
  config: DataSourceConfig
  lastSync?: Date
  createdAt: Date
}

export interface DataSourceConfig {
  url?: string
  apiKey?: string
  sheetId?: string
  range?: string
  headers?: Record<string, string>
}

