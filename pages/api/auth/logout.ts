import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Clear the auth cookie
    res.setHeader('Set-Cookie', 'auth-token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict')

    return res.status(200).json({
      success: true,
      message: 'Logout successful'
    })

  } catch (error: any) {
    console.error('❌ LOGOUT ERROR:', error)
    return res.status(500).json({ error: 'Logout failed' })
  }
}
