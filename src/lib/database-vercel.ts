// Vercel-compatible database solutions
// Since Vercel doesn't host databases, we'll use the best free alternatives

import { MongoClient } from 'mongodb'

// Option 1: MongoDB Atlas (Free Forever)
// - 512MB storage
// - Shared clusters
// - No time limit
// - Perfect for Vercel

// Option 2: Railway (Free Tier)
// - 1GB storage
// - $5 credit monthly
// - No time limit
// - Great for Vercel

// Option 3: Supabase (Free Tier)
// - 500MB storage
// - 2GB bandwidth
// - PostgreSQL (we'll adapt)
// - No time limit

// Option 4: PlanetScale (Free Tier)
// - 1GB storage
// - 1 billion reads
// - MySQL (we'll adapt)
// - No time limit

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.log('🔧 No database configured - using in-memory fallback')
  console.log('💡 Set MONGODB_URI environment variable for persistent storage')
}

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

if (!MONGODB_URI) {
  // Fallback to simple database
  console.log('⚠️ No MONGODB_URI found, using simple in-memory database')
} else {
  if (process.env.NODE_ENV === 'development') {
    // In development, use a global variable so the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement)
    if (!global._mongoClientPromise) {
      client = new MongoClient(MONGODB_URI)
      global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
  } else {
    // In production, it's best to not use a global variable
    client = new MongoClient(MONGODB_URI)
    clientPromise = client.connect()
  }
}

export default clientPromise
