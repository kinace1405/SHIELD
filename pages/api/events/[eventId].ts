// pages/api/events/[eventId].ts
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const Database = require("@replit/database");
const db = new Database();
const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as { username: string };
    const username = decoded.username;

    const { eventId } = req.query;
    if (typeof eventId !== 'string') {
      res.status(400).json({ error: 'Invalid event ID' });
      return;
    }

    const events = await db.get(`events:${username}`) || [];

    if (req.method === 'PUT') {
      const eventIndex = events.findIndex(e => e.id === eventId);
      if (eventIndex === -1) {
        res.status(404).json({ error: 'Event not found' });
        return;
      }

      const updatedEvent = {
        ...events[eventIndex],
        ...req.body,
        id: eventId // Preserve the original ID
      };

      events[eventIndex] = updatedEvent;
      await db.set(`events:${username}`, events);
      res.status(200).json(updatedEvent);
      return;
    }

    if (req.method === 'DELETE') {
      const filteredEvents = events.filter(e => e.id !== eventId);
      if (filteredEvents.length === events.length) {
        res.status(404).json({ error: 'Event not found' });
        return;
      }

      await db.set(`events:${username}`, filteredEvents);
      res.status(200).json({ message: 'Event deleted successfully' });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}