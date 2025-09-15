import mongoose, { Connection } from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

// If no MongoDB URI is provided, we'll use the simple database
if (!MONGODB_URI) {
  console.log('⚠️ No MONGODB_URI found, using simple in-memory database')
  console.log('💡 To use MongoDB Atlas, set MONGODB_URI environment variable')
}

// Simple approach - create new connection each time
// This is more reliable and avoids global variable issues
async function connectDB(): Promise<Connection | null> {
  // If no MongoDB URI, return null (will use simple database)
  if (!MONGODB_URI) {
    console.log('⚠️ No MONGODB_URI found, using simple in-memory database')
    return null
  }

  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection
    }

    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
    
    const connection = await mongoose.connect(MONGODB_URI, opts)
    console.log('✅ Connected to MongoDB')
    return connection.connection
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message)
    return null
  }
}

export default connectDB

