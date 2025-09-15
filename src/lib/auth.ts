import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import connectDB from './database'
import User from './models/User'
import bcrypt from 'bcryptjs'

// Validate environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error('❌ Missing Google OAuth credentials')
}

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID || '',
      clientSecret: GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('🔐 Credentials authorize called:', { email: credentials?.email })
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials')
          return null
        }

        try {
          console.log('🔌 Connecting to database...')
          await connectDB()
          
          const email = credentials.email.toLowerCase().trim()
          console.log('🔍 Looking for user with email:', email)
          
          const user = await User.findOne({ email })
          console.log('👤 User found:', user ? 'Yes' : 'No')
          
          if (!user) {
            console.log('❌ No user found with this email')
            return null
          }

          if (!user.password) {
            console.log('❌ User has no password (Google user)')
            return null
          }

          console.log('🔐 Checking password...')
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          console.log('🔐 Password valid:', isPasswordValid)
          
          if (!isPasswordValid) {
            console.log('❌ Invalid password')
            return null
          }

          console.log('✅ Credentials authentication successful')
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error('❌ Credentials auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === 'google') {
          await connectDB()
          
          if (!user?.email) {
            return false
          }

          const email = user.email.toLowerCase().trim()
          let existingUser = await User.findOne({ email })
          
          if (!existingUser) {
            const newUser = new User({
              name: user.name || 'Google User',
              email: email,
              image: user.image,
              provider: 'google'
            })
            
            await newUser.save()
            user.id = newUser._id.toString()
          } else {
            user.id = existingUser._id.toString()
          }
        }
        
        return true
      } catch (error) {
        console.error('SignIn callback error:', error)
        return false
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.image = user.image
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.image as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('Sign-in event:', { user: user?.email, provider: account?.provider })
    },
    async signOut({ token, session }) {
      console.log('Sign-out event:', { user: session?.user?.email })
    },
  },
}
