export function withPermission(permission: string | string[]) {
  return function(req: NextApiRequest, res: NextApiResponse, next: () => void) {
    const user = req.user; // Set by previous auth middleware
    const permissions = Array.isArray(permission) ? permission : [permission];

    if (!hasAnyPermission(user, permissions)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}