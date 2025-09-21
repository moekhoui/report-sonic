import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../src/contexts/AuthContext'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import Logo from '../../src/components/Logo'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const result = await login(email, password)
      
      if (result.success) {
        setMessage('Login successful! Redirecting...')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      // Use NextAuth signIn with redirect for Google OAuth
      await signIn('google', { 
        callbackUrl: '/dashboard'
      })
    } catch (err) {
      console.error('Google sign-in error:', err)
      setError('Google sign-in failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Logo size="lg" variant="full" className="justify-center" />
        </div>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          color: '#333',
          fontSize: '28px',
          fontWeight: 'bold'
        }}>
          Sign In
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#555',
              fontWeight: '500'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e1e5e9',
                borderRadius: '6px',
                fontSize: '16px',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#a855f7'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#555',
              fontWeight: '500'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e1e5e9',
                borderRadius: '6px',
                fontSize: '16px',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#a855f7'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ 
          margin: '20px 0', 
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{
            height: '1px',
            background: '#e1e5e9',
            width: '100%',
            position: 'absolute',
            top: '50%'
          }}></div>
          <span style={{
            background: 'white',
            padding: '0 15px',
            color: '#666',
            fontSize: '14px'
          }}>
            OR
          </span>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: 'white',
            color: '#333',
            border: '2px solid #e1e5e9',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.currentTarget.style.borderColor = '#db4437'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(219, 68, 55, 0.2)'
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.currentTarget.style.borderColor = '#e1e5e9'
              e.currentTarget.style.boxShadow = 'none'
            }
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>

        {message && (
          <div style={{
            marginTop: '20px',
            padding: '12px',
            background: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{
            marginTop: '20px',
            padding: '12px',
            background: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <div style={{ 
          marginTop: '20px', 
          textAlign: 'center',
          color: '#666'
        }}>
          <Link href="/auth/forgot-password" style={{ 
            color: '#a855f7', 
            textDecoration: 'none',
            fontWeight: '500',
            fontSize: '14px'
          }}>
            Forgot your password?
          </Link>
        </div>

        <div style={{ 
          marginTop: '10px', 
          textAlign: 'center',
          color: '#666'
        }}>
          <Link href="/auth/signup" style={{ 
            color: '#a855f7', 
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}