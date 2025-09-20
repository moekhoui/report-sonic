const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://khouildimy_db_user:2A5hvPZkkDbqJL9@report-sonic.zagspw2.mongodb.net/reportsonic?retryWrites=true&w=majority&appName=report-sonic';

async function clearDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear all users
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const result = await User.deleteMany({});
    console.log(`🗑️  Deleted ${result.deletedCount} users from database`);

    // Clear all reports
    const Report = mongoose.model('Report', new mongoose.Schema({}, { strict: false }));
    const reportResult = await Report.deleteMany({});
    console.log(`🗑️  Deleted ${reportResult.deletedCount} reports from database`);

    console.log('✅ Database cleared successfully!');
    console.log('🎉 Ready for fresh testing!');
    
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

clearDatabase();
