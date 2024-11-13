export function usePermissions() {
  const { user } = useAuth();

  return {
    can: (permission: string) => hasPermission(user, permission),
    canAny: (permissions: string[]) => hasAnyPermission(user, permissions),
    canAll: (permissions: string[]) => hasAllPermissions(user, permissions),
    check: (permission: string) => {
      if (!hasPermission(user, permission)) {
        throw new Error(`Missing required permission: ${permission}`);
      }
    }
  };
}