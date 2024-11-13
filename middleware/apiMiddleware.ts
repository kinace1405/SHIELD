import { NextApiRequest, NextApiResponse } from 'next'
import cors from 'cors'

export const corsMiddleware = cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://your-frontend-domain.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})

// Helper function to run middleware
export function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}