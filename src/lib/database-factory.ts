// Database factory that works with multiple free database providers
// This gives you the maximum free limits across different providers

export interface DatabaseConfig {
  type: 'mongodb' | 'postgresql' | 'mysql' | 'simple'
  uri?: string
  name: string
  limits: {
    storage: string
    bandwidth?: string
    reads?: string
    timeLimit: string
  }
}

export const databaseOptions: DatabaseConfig[] = [
  {
    type: 'mongodb',
    name: 'MongoDB Atlas',
    limits: {
      storage: '512MB',
      timeLimit: 'Free forever'
    }
  },
  {
    type: 'mongodb',
    name: 'Railway',
    limits: {
      storage: '1GB',
      timeLimit: 'Free forever ($5 credit monthly)'
    }
  },
  {
    type: 'postgresql',
    name: 'Supabase',
    limits: {
      storage: '500MB',
      bandwidth: '2GB monthly',
      timeLimit: 'Free forever'
    }
  },
  {
    type: 'mysql',
    name: 'PlanetScale',
    limits: {
      storage: '1GB',
      reads: '1 billion monthly',
      timeLimit: 'Free forever'
    }
  },
  {
    type: 'simple',
    name: 'In-Memory (Fallback)',
    limits: {
      storage: 'Unlimited (RAM only)',
      timeLimit: 'Resets on restart'
    }
  }
]

export function getDatabaseConfig(): DatabaseConfig {
  const mongoUri = process.env.MONGODB_URI
  const postgresUri = process.env.DATABASE_URL
  
  if (mongoUri && mongoUri.startsWith('mongodb')) {
    return databaseOptions[0] // MongoDB Atlas
  }
  
  if (postgresUri && postgresUri.startsWith('postgresql')) {
    return databaseOptions[2] // Supabase
  }
  
  if (postgresUri && postgresUri.startsWith('mysql')) {
    return databaseOptions[3] // PlanetScale
  }
  
  return databaseOptions[4] // Simple fallback
}

export function getDatabaseLimits(): string {
  const config = getDatabaseConfig()
  const limits = config.limits
  
  let limitText = `Storage: ${limits.storage}`
  
  if (limits.bandwidth) {
    limitText += `, Bandwidth: ${limits.bandwidth}`
  }
  
  if (limits.reads) {
    limitText += `, Reads: ${limits.reads}`
  }
  
  limitText += `, Time: ${limits.timeLimit}`
  
  return limitText
}
