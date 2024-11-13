// pages/api/chat.ts
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { addMessage, getMessages } from '../../utils/db';
import { log } from '../../utils/logger';

const WEBHOOK_URL = 'https://hook.eu2.make.com/77b6cxnt20xae993i098g9899rr4p61j';
const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verify JWT token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, JWT_SECRET as string) as {
      username: string;
    };

    if (req.method === 'GET') {
      const messages = await getMessages(decoded.username);
      return res.status(200).json(messages);
    }

    if (req.method === 'POST') {
      const { content } = req.body;

      // Log the outgoing request
      console.log('Sending to webhook:', {
        username: decoded.username,
        message: content
      });

      // Store user message
      await addMessage(decoded.username, {
        content,
        isUser: true,
        timestamp: new Date().toISOString()
      });

      // Send to webhook with improved error handling
      try {
        const webhookResponse = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: decoded.username,
            message: content,
            timestamp: new Date().toISOString()
          })
        });

        // Log webhook response status
        console.log('Webhook response status:', webhookResponse.status);

        if (!webhookResponse.ok) {
          // Try to get error details if available
          const errorText = await webhookResponse.text();
          console.error('Webhook error response:', errorText);
          throw new Error(`Webhook request failed with status ${webhookResponse.status}`);
        }

        const responseText = await webhookResponse.text();
        console.log('Webhook response:', responseText);

        // Store AI response
        await addMessage(decoded.username, {
          content: responseText,
          isUser: false,
          timestamp: new Date().toISOString()
        });

        return res.status(200).send(responseText);
      } catch (webhookError) {
        console.error('Webhook Error Details:', webhookError);
        throw new Error('Failed to communicate with webhook service');
      }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('Chat API Error:', {
      message: error.message,
      stack: error.stack,
      type: error.constructor.name
    });

    res.status(error.statusCode || 500).json({
      error: error.message || 'Internal Server Error'
    });
  }
}