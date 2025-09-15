import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import connectDB from '../../../src/lib/database'
import User from '../../../src/lib/models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('📝 Registration API called:', req.method)
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { name, email, password } = req.body
    console.log('📝 Registration data:', { name, email, password: password ? '***' : 'missing' })

    // Validation
    if (!name || !email || !password) {
      console.log('❌ Missing required fields')
      return res.status(400).json({ error: 'Name, email, and password are required' })
    }

    if (password.length < 6) {
      console.log('❌ Password too short')
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format')
      return res.status(400).json({ error: 'Please enter a valid email address' })
    }

    console.log('🔌 Connecting to database...')
    await connectDB()
    console.log('✅ Database connected successfully')

    // Check if user already exists
    const normalizedEmail = email.toLowerCase().trim()
    console.log('🔍 Checking for existing user:', normalizedEmail)
    
    const existingUser = await User.findOne({ email: normalizedEmail })
    console.log('👤 Existing user found:', existingUser ? 'Yes' : 'No')
    
    if (existingUser) {
      console.log('❌ User already exists')
      return res.status(400).json({ error: 'User already exists with this email' })
    }

    // Hash password
    console.log('🔐 Hashing password...')
    const hashedPassword = await bcrypt.hash(password, 12)
    console.log('✅ Password hashed successfully')

    // Create user
    console.log('👤 Creating new user...')
    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      provider: 'credentials'
    })

    await user.save()
    console.log('✅ User created successfully:', user._id)

    return res.status(201).json({ 
      message: 'Account created successfully! Welcome to ReportSonic!', 
      userId: user._id,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    })
  } catch (error: any) {
    console.error('❌ Registration error:', error)
    
    if (error.code === 11000) {
      return res.status(400).json({ error: 'User already exists with this email' })
    }
    
    return res.status(500).json({ error: 'Failed to create account. Please try again.' })
  }
}
