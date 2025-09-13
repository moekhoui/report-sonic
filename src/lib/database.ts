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
    return null
  }

  try {
    const opts = {
      bufferCommands: false,
    }
    
    const connection = await mongoose.connect(MONGODB_URI, opts)
    return connection.connection
  } catch (error) {
    console.error('MongoDB connection error:', error)
    return null
  }
}

export default connectDB

