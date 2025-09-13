// Database configuration that works with both MongoDB Atlas and simple database

const MONGODB_URI = process.env.MONGODB_URI;

// Check if we have a MongoDB URI (Atlas or local)
const useMongoDB = MONGODB_URI && MONGODB_URI.startsWith('mongodb');

export const databaseConfig = {
  useMongoDB,
  uri: MONGODB_URI,
  fallbackToSimple: !useMongoDB
};

// Simple database fallback for development/testing
if (databaseConfig.fallbackToSimple) {
  console.log('🔧 Using simple in-memory database (development mode)');
  console.log('💡 To use MongoDB Atlas, set MONGODB_URI environment variable');
} else {
  console.log('🗄️ Using MongoDB Atlas database');
}
