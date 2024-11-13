export function hasPermission(user: User, permission: string): boolean {
  return user.permissions.includes(permission);
}

export function hasAnyPermission(user: User, permissions: string[]): boolean {
  return permissions.some(permission => hasPermission(user, permission));
}

export function hasAllPermissions(user: User, permissions: string[]): boolean {
  return permissions.every(permission => hasPermission(user, permission));
}