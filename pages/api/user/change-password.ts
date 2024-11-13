import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/utils/auth';
import { log } from '@/utils/logger';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const user = await verifyToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const userData = await db.getUserById(user.id);
    const isValid = await bcrypt.compare(currentPassword, userData.password);
    if (!isValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.updateUserPassword(user.id, hashedPassword);

    // Log the activity
    await logActivity({
      userId: user.id,
      action: 'password.changed',
      details: { ip: req.socket.remoteAddress }
    });

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    log('error', 'Password Change Error:', { error });
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}