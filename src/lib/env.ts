// Environment variables validation
export const env = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://reportsonic:reportsonic123@cluster0.mongodb.net/reportsonic?retryWrites=true&w=majority',
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'https://report-sonic.vercel.app',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || '',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
}

