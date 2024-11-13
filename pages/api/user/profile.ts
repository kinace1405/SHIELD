        import { NextApiRequest, NextApiResponse } from 'next'
        import { corsMiddleware, runMiddleware } from '../../middleware/apiMiddleware'
        import { Database } from '@replit/database'
        import jwt from 'jsonwebtoken'

        const db = new Database()
        const JWT_SECRET = process.env.JWT_SECRET

        interface ProfileData {
          email?: string
          company?: string
          role?: string
          phone?: string
          notificationPreferences?: {
            email: boolean
            browser: boolean
            mobile: boolean
          }
          subscriptionTier?: string
          timezone?: string
          language?: string
          lastUpdated?: string
        }

        export default async function handler(req: NextApiRequest, res: NextApiResponse) {
          try {
            // Run CORS middleware
            await runMiddleware(req, res, corsMiddleware)

            // Verify JWT token
            const token = req.headers.authorization?.split(' ')[1]
            if (!token) {
              return res.status(401).json({ error: 'No token provided' })
            }

            const decoded = jwt.verify(token, JWT_SECRET as string) as { username: string }
            const username = decoded.username

            switch (req.method) {
              case 'GET':
                return await getProfile(username, res)
              case 'PUT':
                return await updateProfile(username, req.body, res)
              case 'PATCH':
                return await updateProfileSettings(username, req.body, res)
              default:
                res.setHeader('Allow', ['GET', 'PUT', 'PATCH'])
                return res.status(405).end(`Method ${req.method} Not Allowed`)
            }
          } catch (error) {
            console.error('Profile API Error:', error)
            return res.status(500).json({ error: 'Internal Server Error' })
          }
        }

        async function getProfile(username: string, res: NextApiResponse) {
          try {
            const profile = await db.get(`profile:${username}`)
            if (!profile) {
              return res.status(404).json({ error: 'Profile not found' })
            }
            return res.status(200).json(profile)
          } catch (error) {
            console.error('Get Profile Error:', error)
            return res.status(500).json({ error: 'Failed to fetch profile' })
          }
        }

        async function updateProfile(username: string, data: ProfileData, res: NextApiResponse) {
          try {
            // Validate required fields
            if (!data.email || !data.company) {
              return res.status(400).json({ error: 'Email and company are required' })
            }

            // Get existing profile or create new one
            let profile = await db.get(`profile:${username}`) || {}

            // Update profile data
            const updatedProfile = {
              ...profile,
              ...data,
              lastUpdated: new Date().toISOString()
            }

            await db.set(`profile:${username}`, updatedProfile)
            return res.status(200).json(updatedProfile)
          } catch (error) {
            console.error('Update Profile Error:', error)
            return res.status(500).json({ error: 'Failed to update profile' })
          }
        }

        async function updateProfileSettings(username: string, data: Partial<ProfileData>, res: NextApiResponse) {
          try {
            // Get existing profile
            const profile = await db.get(`profile:${username}`)
            if (!profile) {
              return res.status(404).json({ error: 'Profile not found' })
            }

            // Update only provided settings
            const updatedProfile = {
              ...profile,
              ...data,
              lastUpdated: new Date().toISOString()
            }

            await db.set(`profile:${username}`, updatedProfile)
            return res.status(200).json(updatedProfile)
          } catch (error) {
            console.error('Update Settings Error:', error)
            return res.status(500).json({ error: 'Failed to update settings' })
          }
        }

        // Helper function to validate email format
        function isValidEmail(email: string): boolean {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return emailRegex.test(email)
        }