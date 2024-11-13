export async function logActivity(data: Partial<ActivityLog>) {
  try {
    const log = {
      ...data,
      timestamp: new Date().toISOString(),
    };

    await db.createActivityLog(log);

    // If it's a security-related action, also create a security log
    if (isSecurityAction(data.action)) {
      await createSecurityLog(log);
    }
  } catch (error) {
    console.error('Failed to create activity log:', error);
  }
}
