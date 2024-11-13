import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { log } from '../../../utils/logger';

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      username: string;
      subscriptionTier: string;
    };

    const form = formidable({
      uploadDir: path.join(process.cwd(), 'uploads'),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024 // 10MB
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'File upload failed' });
      }

      const file = files.file;
      if (!file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      // Process file with make.com webhook
      const webhookResponse = await fetch(process.env.WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: decoded.username,
          subscriptionTier: decoded.subscriptionTier,
          action: 'process_document',
          file: {
            name: file.originalFilename,
            path: file.filepath,
            type: file.mimetype
          }
        })
      });

      if (!webhookResponse.ok) {
        throw new Error('Document processing failed');
      }

      const responseText = await webhookResponse.text();
      res.status(200).send(responseText);
    });
  } catch (error) {
    log('error', 'Document upload error:', { error });
    res.status(500).json({ error: 'Internal server error' });
  }
}