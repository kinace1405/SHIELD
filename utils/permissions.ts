// utils/permissions.ts
export const PERMISSIONS = {
  DOCUMENTS: {
    VIEW: 'document.view',
    CREATE: 'document.create',
    EDIT: 'document.edit',
    DELETE: 'document.delete',
  },
  TRAINING: {
    VIEW: 'training.view',
    MANAGE: 'training.manage',
    CREATE: 'training.create',
    ASSIGN: 'training.assign',
  },
  REPORTS: {
    VIEW: 'reports.view',
    CREATE: 'reports.create',
    EXPORT: 'reports.export',
  },
  USERS: {
    VIEW: 'users.view',
    MANAGE: 'users.manage',
  },
  SHIELD: {
    USE: 'shield.use',
    ADMIN: 'shield.admin',
  }
} as const;

export const ROLE_PERMISSIONS = {
  user: [
    PERMISSIONS.DOCUMENTS.VIEW,
    PERMISSIONS.TRAINING.VIEW,
    PERMISSIONS.REPORTS.VIEW,
    PERMISSIONS.SHIELD.USE,
  ],
  manager: [
    ...ROLE_PERMISSIONS.user,
    PERMISSIONS.DOCUMENTS.CREATE,
    PERMISSIONS.DOCUMENTS.EDIT,
    PERMISSIONS.TRAINING.MANAGE,
    PERMISSIONS.TRAINING.ASSIGN,
    PERMISSIONS.REPORTS.CREATE,
  ],
  admin: Object.values(PERMISSIONS).flatMap(group => Object.values(group))
};