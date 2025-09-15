import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import connectDB from './database'
import User from './models/User'
import bcrypt from 'bcryptjs'
import { sendEmail, generateWelcomeEmail } from './email'

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        try {
          await connectDB()
          const user = await User.findOne({ email: credentials.email.toLowerCase() })
          
          if (!user) {
            throw new Error('No user found with this email')
          }

          if (!user.password) {
            throw new Error('Please sign in with Google or reset your password')
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          if (!isPasswordValid) {
            throw new Error('Invalid password')
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error('Auth error:', error)
          throw error
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectDB()
        
        if (account?.provider === 'google') {
          const existingUser = await User.findOne({ email: user.email })
          
          if (!existingUser) {
            // Create new user for Google OAuth
            const newUser = new User({
              name: user.name,
              email: user.email?.toLowerCase(),
              image: user.image,
              provider: 'google'
            })
            await newUser.save()
            console.log('✅ Created new Google user:', newUser.email)
            
            // Send welcome email
            try {
              await sendEmail(generateWelcomeEmail(newUser.name, newUser.email))
              console.log('📧 Welcome email sent to:', newUser.email)
            } catch (emailError) {
              console.error('Email sending failed:', emailError)
            }
          } else {
            console.log('✅ Existing Google user signed in:', existingUser.email)
          }
        }
        
        return true
      } catch (error) {
        console.error('Sign-in callback error:', error)
        return false
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string
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
      console.log('🔐 Sign-in event:', { user: user.email, provider: account?.provider, isNewUser })
    },
    async signOut({ token, session }) {
      console.log('🚪 Sign-out event:', { user: session?.user?.email })
    },
  },
}
