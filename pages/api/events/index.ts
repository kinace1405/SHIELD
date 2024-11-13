// pages/api/events/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const Database = require("@replit/database");
const db = new Database();
const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify JWT token
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as { username: string };
    const username = decoded.username;

    if (req.method === 'GET') {
      const events = await db.get(`events:${username}`) || [];
      res.status(200).json(events);
      return;
    }

    if (req.method === 'POST') {
      const { title, start, end, type } = req.body;

      if (!title || !start || !end || !type) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const events = await db.get(`events:${username}`) || [];
      const newEvent = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title,
        start,
        end,
        type,
        location: req.body.location || '',
        description: req.body.description || '',
        attendees: req.body.attendees || []
      };

      events.push(newEvent);
      await db.set(`events:${username}`, events);
      res.status(201).json(newEvent);
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}