interface PermissionGuardProps {
  children: React.ReactNode;
  permission: string | string[];
  fallback?: React.ReactNode;
  requireAll?: boolean;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  fallback = null,
  requireAll = false,
}) => {
  const { user } = useAuth();

  if (!user) return fallback;

  const permissions = Array.isArray(permission) ? permission : [permission];
  const hasAccess = requireAll 
    ? hasAllPermissions(user, permissions)
    : hasAnyPermission(user, permissions);

  return hasAccess ? children : fallback;
};

// Example usage in components:
function SecureComponent() {
  return (
    <PermissionGuard 
      permission={[PERMISSIONS.DOCUMENTS.EDIT, PERMISSIONS.DOCUMENTS.DELETE]}
      fallback={<p>You don't have permission to view this content.</p>}
    >
      <div>Secure content here</div>
    </PermissionGuard>
  );
}