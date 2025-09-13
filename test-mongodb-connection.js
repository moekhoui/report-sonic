// Test MongoDB Atlas connection
const { MongoClient } = require('mongodb');

// Your connection string
const MONGODB_URI = 'mongodb+srv://khouildimy_db_user:2A5hvPZkkDbqJL9@report-sonic.zagspw2.mongodb.net/reportsonic?retryWrites=true&w=majority&appName=report-sonic';

async function testConnection() {
  console.log('🔌 Testing MongoDB Atlas connection...');
  console.log('Connection string:', MONGODB_URI.replace('<db_password>', '***'));
  
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test database operations
    const db = client.db('reportsonic');
    const collection = db.collection('test');
    
    // Insert a test document
    const testDoc = {
      message: 'Hello from ReportSonic!',
      timestamp: new Date(),
      test: true
    };
    
    const result = await collection.insertOne(testDoc);
    console.log('✅ Test document inserted:', result.insertedId);
    
    // Find the test document
    const foundDoc = await collection.findOne({ _id: result.insertedId });
    console.log('✅ Test document found:', foundDoc);
    
    // Clean up test document
    await collection.deleteOne({ _id: result.insertedId });
    console.log('✅ Test document cleaned up');
    
    await client.close();
    console.log('✅ Connection closed successfully');
    console.log('');
    console.log('🎉 MongoDB Atlas is working perfectly!');
    console.log('🚀 Ready for Vercel deployment!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Make sure you replaced <db_password> with your actual password');
    console.log('2. Check if your IP is whitelisted in MongoDB Atlas');
    console.log('3. Verify your database user has read/write permissions');
  }
}

testConnection();
