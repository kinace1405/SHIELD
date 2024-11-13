      // pages/api/events/index.ts
      import { NextApiRequest, NextApiResponse } from 'next';
      import jwt from 'jsonwebtoken';
      import type { Event } from '@/types/calendar';

      const Database = require("@replit/database");
      const db = new Database();
      const JWT_SECRET = process.env.JWT_SECRET;

      async function getEvents(username: string, query: any) {
        const { start, end } = query;
        const events: Event[] = await db.get(`events:${username}`) || [];

        if (start && end) {
          return events.filter(event => {
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);
            const queryStart = new Date(start);
            const queryEnd = new Date(end);
            return eventStart >= queryStart && eventEnd <= queryEnd;
          });
        }

        return events;
      }

      async function createEvent(username: string, eventData: Partial<Event>) {
        const newEvent: Event = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: eventData.title!,
          start: eventData.start!,
          end: eventData.end!,
          type: eventData.type!,
          location: eventData.location || '',
          description: eventData.description || '',
          attendees: eventData.attendees || []
        };

        const events = await db.get(`events:${username}`) || [];
        events.push(newEvent);
        await db.set(`events:${username}`, events);

        return newEvent;
      }

      export default async function handler(
        req: NextApiRequest,
        res: NextApiResponse
      ) {
        try {
          // Verify JWT token
          const token = req.headers.authorization?.split(' ')[1];
          if (!token) {
            res.status(401).json({ error: 'No token provided' });
            return;
          }

          const decoded = jwt.verify(token, JWT_SECRET as string) as { username: string };
          const username = decoded.username;

          if (req.method === 'GET') {
            const events = await getEvents(username, req.query);
            res.status(200).json(events);
            return;
          }

          if (req.method === 'POST') {
            // Validate required fields
            const { title, start, end, type } = req.body;
            if (!title || !start || !end || !type) {
              res.status(400).json({ error: 'Missing required fields' });
              return;
            }

            const newEvent = await createEvent(username, req.body);
            res.status(201).json(newEvent);
            return;
          }

          res.setHeader('Allow', ['GET', 'POST']);
          res.status(405).json({ error: `Method ${req.method} Not Allowed` });
        } catch (error) {
          console.error('Calendar API Error:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      }