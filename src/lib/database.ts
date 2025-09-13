import mongoose, { Connection } from 'mongoose'
import { databaseConfig } from './database-config'

const MONGODB_URI = process.env.MONGODB_URI

// If no MongoDB URI is provided, we'll use the simple database
if (!MONGODB_URI) {
  console.log('⚠️ No MONGODB_URI found, using simple in-memory database')
  console.log('💡 To use MongoDB Atlas, set MONGODB_URI environment variable')
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB(): Promise<Connection | null> {
  // If no MongoDB URI, return null (will use simple database)
  if (!MONGODB_URI) {
    return null
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI!, opts)
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default connectDB

