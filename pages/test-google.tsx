import { useState } from 'react'
import { signIn, getProviders } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function TestGoogle() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [providers, setProviders] = useState<any>(null)
  
  const router = useRouter()

  const testProviders = async () => {
    try {
      const providersData = await getProviders()
      setProviders(providersData)
      console.log('Providers:', providersData)
    } catch (err) {
      console.error('Error getting providers:', err)
      setError('Failed to get providers')
    }
  }

  const testGoogleSignIn = async () => {
    setLoading(true)
    setError('')

    try {
      console.log('Starting Google sign-in...')
      const result = await signIn('google', { 
        callbackUrl: '/dashboard',
        redirect: false 
      })
      
      console.log('Sign-in result:', result)
      
      if (result?.error) {
        setError(`Google sign-in error: ${result.error}`)
      } else if (result?.ok) {
        console.log('Google sign-in successful!')
        router.push('/dashboard')
      } else {
        setError('Google sign-in failed')
      }
    } catch (err) {
      console.error('Google sign-in error:', err)
      setError('Google sign-in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '600px'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          color: '#333',
          fontSize: '28px',
          fontWeight: 'bold'
        }}>
          Google OAuth Test
        </h1>

        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={testProviders}
            style={{
              width: '100%',
              padding: '12px',
              background: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '10px'
            }}
          >
            Test Get Providers
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={testGoogleSignIn}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#ccc' : '#db4437',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Testing Google Sign-In...' : 'Test Google Sign-In'}
          </button>
        </div>

        {providers && (
          <div style={{
            marginTop: '20px',
            padding: '12px',
            background: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
            borderRadius: '6px'
          }}>
            <h3>Available Providers:</h3>
            <pre>{JSON.stringify(providers, null, 2)}</pre>
          </div>
        )}

        {error && (
          <div style={{
            marginTop: '20px',
            padding: '12px',
            background: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '6px'
          }}>
            {error}
          </div>
        )}

        <div style={{ 
          marginTop: '20px', 
          textAlign: 'center'
        }}>
          <a href="/auth/signin" style={{ 
            color: '#667eea', 
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            Back to Sign In
          </a>
        </div>
      </div>
    </div>
  )
}
