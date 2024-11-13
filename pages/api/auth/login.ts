// pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUser } from '../../../utils/db';
import { log } from '../../../utils/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    // Log login attempt
    console.log(`Login attempt for username: ${username}`);

    // Get user with verbose logging
    const user = await getUser(username);
    if (!user) {
      console.log(`User not found: ${username}`);
      return res.status(400).json({ error: 'User not found' });
    }

    console.log(`User found: ${username}, email: ${user.email}`);

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Password match for ${username}: ${isMatch}`);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        username: user.username,
        email: user.email,
        subscriptionTier: user.subscriptionTier,
        isAdmin: user.isAdmin 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Log successful login
    console.log(`Successful login for ${username}`);

    res.status(200).json({ 
      token,
      user: {
        username: user.username,
        email: user.email,
        subscriptionTier: user.subscriptionTier,
        isAdmin: user.isAdmin
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}