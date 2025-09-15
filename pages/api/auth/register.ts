import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import connectDB from '../../../src/lib/database'
import User from '../../../src/lib/models/User'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { name, email, password } = req.body

    console.log('Registration attempt:', { name, email, password: password ? '***' : 'missing' })

    if (!name || !email || !password) {
      console.log('Missing required fields')
      return res.status(400).json({ error: 'Name, email, and password are required' })
    }

    if (password.length < 6) {
      console.log('Password too short')
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    console.log('Connecting to database...')
    await connectDB()
    console.log('Database connected successfully')

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    console.log('Existing user check:', existingUser ? 'User exists' : 'No existing user')
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' })
    }

    // Hash password
    console.log('Hashing password...')
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    console.log('Creating user...')
    const user = new User({
      name,
      email,
      password: hashedPassword,
    })

    await user.save()
    console.log('User created successfully:', user._id)

    return res.status(201).json({ message: 'User created successfully', userId: user._id })
  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json({ error: 'Internal server error: ' + (error as Error).message })
  }
}
