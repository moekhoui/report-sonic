import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'

export default function TestLogin() {
  const [email, setEmail] = useState('test@reportsonic.com')
  const [password, setPassword] = useState('test123456')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult('')

    try {
      console.log('🔐 ATTEMPTING LOGIN:', { email, password })
      
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      console.log('🔐 LOGIN RESULT:', res)
      setResult(JSON.stringify(res, null, 2))

      if (res?.ok) {
        const session = await getSession()
        console.log('🔐 SESSION:', session)
        setResult(prev => prev + '\n\nSESSION: ' + JSON.stringify(session, null, 2))
      }
    } catch (error: any) {
      console.error('🔐 LOGIN ERROR:', error)
      setResult('ERROR: ' + (error?.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Test Login Debug</h1>
      
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#0070f3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Logging in...' : 'Test Login'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>Result:</h3>
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '5px',
            overflow: 'auto',
            whiteSpace: 'pre-wrap'
          }}>
            {result}
          </pre>
        </div>
      )}
    </div>
  )
}
