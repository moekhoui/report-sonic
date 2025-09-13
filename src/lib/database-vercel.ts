// Vercel-compatible database solutions
// Since Vercel doesn't host databases, we'll use the best free alternatives

import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.log('🔧 No database configured - using in-memory fallback')
  console.log('💡 Set MONGODB_URI environment variable for persistent storage')
}

// Simple approach - create new connection each time
// This is more reliable and avoids global variable issues
let clientPromise: Promise<MongoClient> | null = null

if (MONGODB_URI) {
  const client = new MongoClient(MONGODB_URI)
  clientPromise = client.connect()
} else {
  clientPromise = null
}

export default clientPromise
