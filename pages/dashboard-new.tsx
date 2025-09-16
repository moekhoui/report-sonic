import { useAuth } from '../src/contexts/AuthContext'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function DashboardNew() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin-new')
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    await logout()
    router.push('/auth/signin-new')
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '10px',
        padding: '40px',
        maxWidth: '800px',
        margin: '0 auto',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{ 
            color: '#333',
            fontSize: '32px',
            fontWeight: 'bold',
            margin: 0
          }}>
            Welcome to ReportSonic! 🎉
          </h1>
          
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Sign Out
          </button>
        </div>

        <div style={{ 
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <h2 style={{ 
            color: '#333',
            fontSize: '24px',
            marginBottom: '15px'
          }}>
            Your Account
          </h2>
          
          <div style={{ display: 'grid', gap: '10px' }}>
            <div>
              <strong>Name:</strong> {user.name}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div>
              <strong>Plan:</strong> {user.subscription_plan}
            </div>
            <div>
              <strong>Status:</strong> {user.subscription_status}
            </div>
          </div>
        </div>

        <div style={{ 
          background: '#e3f2fd',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #bbdefb'
        }}>
          <h3 style={{ 
            color: '#1976d2',
            fontSize: '20px',
            marginBottom: '15px'
          }}>
            🚀 Authentication Success!
          </h3>
          <p style={{ 
            color: '#666',
            lineHeight: '1.6',
            margin: 0
          }}>
            Your authentication system is now working perfectly! You can access all the platform features from here.
          </p>
        </div>
      </div>
    </div>
  )
}
