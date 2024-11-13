interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  targetId?: string;
  targetType?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}