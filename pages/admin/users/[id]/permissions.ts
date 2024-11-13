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
    const { permissions } = req.body;

    const updatedUser = await db.updateUserPermissions(id as string, permissions);

    // Log permissions change
    await db.createAuditLog({
      userId: admin.id,
      action: 'user.permissions.update',
      targetId: id,
      details: { newPermissions: permissions }
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    log('error', 'User permissions update error:', { error });
    return res.status(500).json({ error: 'Failed to update user permissions' });
  }
}