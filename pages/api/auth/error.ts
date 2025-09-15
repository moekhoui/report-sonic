import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { error } = req.query
  
  let errorMessage = 'An authentication error occurred'
  
  switch (error) {
    case 'Configuration':
      errorMessage = 'There is a problem with the server configuration'
      break
    case 'AccessDenied':
      errorMessage = 'Access was denied. You may not have permission to sign in'
      break
    case 'Verification':
      errorMessage = 'The verification token has expired or has already been used'
      break
    case 'OAuthSignin':
      errorMessage = 'Error in OAuth sign-in process'
      break
    case 'OAuthCallback':
      errorMessage = 'Error in OAuth callback'
      break
    case 'OAuthCreateAccount':
      errorMessage = 'Could not create OAuth account'
      break
    case 'EmailCreateAccount':
      errorMessage = 'Could not create email account'
      break
    case 'Callback':
      errorMessage = 'Error in callback'
      break
    case 'OAuthAccountNotLinked':
      errorMessage = 'Email already exists with a different provider'
      break
    case 'EmailSignin':
      errorMessage = 'Check your email for a sign-in link'
      break
    case 'CredentialsSignin':
      errorMessage = 'Sign in failed. Check your credentials'
      break
    case 'SessionRequired':
      errorMessage = 'Please sign in to access this page'
      break
    default:
      errorMessage = `Authentication error: ${error}`
  }
  
  // Redirect to signin page with error message
  res.redirect(`/auth/signin?error=${encodeURIComponent(errorMessage)}`)
}
