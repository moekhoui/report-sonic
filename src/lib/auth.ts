import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'

// Direct database connection - no complex models
const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  ssl: {
    rejectUnauthorized: false
  }
}

// Simple database functions
async function getConnection() {
  return await mysql.createConnection(dbConfig)
}

async function findUserByEmail(email: string) {
  try {
    const connection = await getConnection()
    const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]) as any[]
    await connection.end()
    return rows.length > 0 ? rows[0] : null
  } catch (error) {
    console.error('Database error:', error)
    return null
  }
}

async function createUser(userData: any) {
  try {
    const { email, name, password, image, provider = 'credentials' } = userData
    
    let hashedPassword = null
    if (password) {
      hashedPassword = await bcrypt.hash(password, 12)
    }

    const connection = await getConnection()
    const [result] = await connection.execute(`
      INSERT INTO users (email, name, password, image, provider, subscription_plan, subscription_status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [email.toLowerCase().trim(), name, hashedPassword, image || null, provider, 'free', 'active']) as any
    
    await connection.end()
    
    // Return the created user
    return await findUserByEmail(email)
  } catch (error) {
    console.error('Create user error:', error)
    return null
  }
}

async function verifyPassword(email: string, password: string) {
  try {
    const user = await findUserByEmail(email)
    if (!user || !user.password) return null
    
    const isValid = await bcrypt.compare(password, user.password)
    return isValid ? user : null
  } catch (error) {
    console.error('Password verification error:', error)
    return null
  }
}

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('🔐 CREDENTIALS AUTH ATTEMPT:', credentials?.email)
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials')
          return null
        }

        try {
          const user = await verifyPassword(credentials.email, credentials.password)
          
          if (!user) {
            console.log('❌ Invalid credentials for:', credentials.email)
            return null
          }

          console.log('✅ CREDENTIALS AUTH SUCCESS:', user.email)
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            image: user.image || null,
            role: user.role || 'user',
          }
        } catch (error) {
          console.error('❌ CREDENTIALS AUTH ERROR:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('🔐 SIGNIN CALLBACK:', { email: user?.email, provider: account?.provider })
      
      if (account?.provider === 'google' && user?.email) {
        try {
          const email = user.email.toLowerCase().trim()
          let existingUser = await findUserByEmail(email)
          
          if (!existingUser) {
            console.log('👤 CREATING GOOGLE USER:', email)
            const newUser = await createUser({
              name: user.name || 'Google User',
              email: email,
              image: user.image || null,
              provider: 'google'
            })
            
            if (newUser) {
              user.id = newUser.id.toString()
              ;(user as any).role = newUser.role || 'user'
              console.log('✅ GOOGLE USER CREATED:', newUser.id)
            } else {
              console.log('❌ FAILED TO CREATE GOOGLE USER')
              return false
            }
          } else {
            user.id = existingUser.id.toString()
            ;(user as any).role = existingUser.role || 'user'
            console.log('✅ EXISTING GOOGLE USER:', existingUser.id)
          }
        } catch (error) {
          console.error('❌ GOOGLE SIGNIN ERROR:', error)
          return false
        }
      }
      
      return true
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      // Always redirect to dashboard after successful login
      return `${baseUrl}/dashboard`
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email || ''
        token.name = user.name || ''
        token.image = user.image || ''
        token.role = (user as any).role || 'user'
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.image as string
        ;(session.user as any).role = token.role as string || 'user'
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
}
