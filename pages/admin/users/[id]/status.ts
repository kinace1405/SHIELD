import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/utils/auth';
import { log } from '@/utils/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const admin = await verifyToken(req);
    if (!admin?.permissions?.includes('users.manage')) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const { id } = req.query;
    const { status } = req.body;

    if (!['active', 'inactive', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updatedUser = await db.updateUserStatus(id as string, status);

    // Log status change
    await db.createAuditLog({
      userId: admin.id,
      action: 'user.status.update',
      targetId: id,
      details: { newStatus: status }
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    log('error', 'User status update error:', { error });
    return res.status(500).json({ error: 'Failed to update user status' });
  }
}