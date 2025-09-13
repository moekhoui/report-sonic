import mongoose, { Document, Schema } from 'mongoose'

export interface IDataSource extends Document {
  userId: string
  name: string
  type: 'csv' | 'google_sheets' | 'api'
  config: {
    url?: string
    apiKey?: string
    sheetId?: string
    range?: string
    headers?: Record<string, string>
  }
  lastSync?: Date
  createdAt: Date
  updatedAt: Date
}

const DataSourceSchema = new Schema<IDataSource>({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['csv', 'google_sheets', 'api'],
    required: true,
  },
  config: {
    url: String,
    apiKey: String,
    sheetId: String,
    range: String,
    headers: Schema.Types.Mixed,
  },
  lastSync: Date,
}, {
  timestamps: true,
})

export default mongoose.models.DataSource || mongoose.model<IDataSource>('DataSource', DataSourceSchema)

