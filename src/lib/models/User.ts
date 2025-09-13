import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  email: string
  name: string
  password?: string
  image?: string
  subscription?: {
    plan: 'free' | 'pro' | 'enterprise'
    status: 'active' | 'canceled' | 'past_due'
    stripeCustomerId?: string
    stripeSubscriptionId?: string
    currentPeriodEnd?: Date
  }
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  image: {
    type: String,
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free',
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'past_due'],
      default: 'active',
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    currentPeriodEnd: Date,
  },
}, {
  timestamps: true,
})

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
