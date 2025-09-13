import mongoose, { Document, Schema } from 'mongoose'

export interface IReport extends Document {
  userId: string
  title: string
  description?: string
  data: any[]
  template: {
    id: string
    name: string
    description: string
    layout: string
    sections: Array<{
      id: string
      type: 'executive_summary' | 'data_analysis' | 'charts' | 'recommendations' | 'custom'
      title: string
      order: number
      required: boolean
    }>
    isPremium: boolean
  }
  branding: {
    logo?: string
    primaryColor: string
    secondaryColor: string
    fontFamily: string
    companyName: string
    clientName?: string
  }
  status: 'draft' | 'generating' | 'completed' | 'failed'
  aiInsights?: {
    summary: string
    keyFindings: string[]
    recommendations: string[]
    dataQuality: {
      completeness: number
      accuracy: number
      consistency: number
    }
  }
  charts?: Array<{
    id: string
    type: 'bar' | 'line' | 'pie' | 'scatter' | 'area'
    title: string
    data: any[]
    config: {
      xAxis?: string
      yAxis?: string
      colors?: string[]
      showLegend?: boolean
      showGrid?: boolean
    }
  }>
  createdAt: Date
  updatedAt: Date
}

const ReportSchema = new Schema<IReport>({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  data: {
    type: [Schema.Types.Mixed],
    default: [],
  },
  template: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    layout: {
      type: String,
      required: true,
    },
    sections: [{
      id: String,
      type: {
        type: String,
        enum: ['executive_summary', 'data_analysis', 'charts', 'recommendations', 'custom'],
      },
      title: String,
      order: Number,
      required: Boolean,
    }],
    isPremium: {
      type: Boolean,
      default: false,
    },
  },
  branding: {
    logo: String,
    primaryColor: {
      type: String,
      default: '#3b82f6',
    },
    secondaryColor: {
      type: String,
      default: '#1e40af',
    },
    fontFamily: {
      type: String,
      default: 'Inter',
    },
    companyName: {
      type: String,
      required: true,
    },
    clientName: String,
  },
  status: {
    type: String,
    enum: ['draft', 'generating', 'completed', 'failed'],
    default: 'draft',
  },
  aiInsights: {
    summary: String,
    keyFindings: [String],
    recommendations: [String],
    dataQuality: {
      completeness: Number,
      accuracy: Number,
      consistency: Number,
    },
  },
  charts: [{
    id: String,
    type: {
      type: String,
      enum: ['bar', 'line', 'pie', 'scatter', 'area'],
    },
    title: String,
    data: [Schema.Types.Mixed],
    config: {
      xAxis: String,
      yAxis: String,
      colors: [String],
      showLegend: Boolean,
      showGrid: Boolean,
    },
  }],
}, {
  timestamps: true,
})

export default mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema)

