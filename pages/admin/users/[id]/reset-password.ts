import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/utils/auth';
import { log } from '@/utils/logger';
import { generatePasswordResetToken } from '@/utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const admin = await verifyToken(req);
    if (!admin?.permissions?.includes('users.manage')) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const { id } = req.query;
    const user = await db.getUser(id as string);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resetToken = await generatePasswordResetToken(user.id);
    await sendPasswordResetEmail(user.email, resetToken);

    return res.status(200).json({ message: 'Password reset email sent' });
      } catch (error) {
        log('error', 'Password reset error:', { error });
        return res.status(500).json({ error: 'Failed to send reset email' });
      }
    }