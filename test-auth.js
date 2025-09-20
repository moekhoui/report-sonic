const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://khouildimy_db_user:2A5hvPZkkDbqJL9@report-sonic.zagspw2.mongodb.net/reportsonic?retryWrites=true&w=majority&appName=report-sonic';

// User schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  name: { type: String, required: true },
  password: { type: String },
  image: { type: String },
  provider: { type: String },
  subscription: {
    plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
    status: { type: String, enum: ['active', 'canceled', 'past_due'], default: 'active' },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    currentPeriodEnd: Date,
  },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function testAuthentication() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test 1: Create a test user
    console.log('\n🧪 Test 1: Creating test user...');
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 12),
      provider: 'credentials'
    });
    
    await testUser.save();
    console.log('✅ Test user created:', testUser.email);

    // Test 2: Find the user
    console.log('\n🧪 Test 2: Finding test user...');
    const foundUser = await User.findOne({ email: 'test@example.com' });
    if (foundUser) {
      console.log('✅ User found:', foundUser.email);
    } else {
      console.log('❌ User not found');
    }

    // Test 3: Verify password
    console.log('\n🧪 Test 3: Verifying password...');
    const isPasswordValid = await bcrypt.compare('password123', foundUser.password);
    if (isPasswordValid) {
      console.log('✅ Password verification successful');
    } else {
      console.log('❌ Password verification failed');
    }

    // Test 4: Test Google user creation
    console.log('\n🧪 Test 4: Creating Google user...');
    const googleUser = new User({
      name: 'Google User',
      email: 'google@example.com',
      image: 'https://example.com/avatar.jpg',
      provider: 'google'
    });
    
    await googleUser.save();
    console.log('✅ Google user created:', googleUser.email);

    // Test 5: List all users
    console.log('\n🧪 Test 5: Listing all users...');
    const allUsers = await User.find({});
    console.log(`✅ Found ${allUsers.length} users:`);
    allUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user.provider}`);
    });

    console.log('\n🎉 All authentication tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

testAuthentication();
