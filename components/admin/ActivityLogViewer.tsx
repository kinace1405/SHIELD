interface ActivityLogViewerProps {
  userId?: string;
  limit?: number;
}

const ActivityLogViewer: React.FC<ActivityLogViewerProps> = ({ 
  userId, 
  limit = 50 
}) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [userId, limit]);

  const fetchLogs = async () => {
    try {
      const response = await fetch(
        `/api/admin/users/activity?${new URLSearchParams({
          ...(userId && { userId }),
          limit: limit.toString()
        })}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch logs');

      const data = await response.json();
      setLogs(data);
    } catch (error) {
      setError('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  const formatActivity = (log: ActivityLog) => {
    const actions = {
      'user.login': 'Logged in',
      'user.logout': 'Logged out',
      'user.created': 'Account created',
      'user.updated': 'Profile updated',
      'user.password.reset': 'Password reset requested',
      'user.permission.updated': 'Permissions updated'
    };

    return actions[log.action] || log.action;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">Activity Log</h3>

      {loading ? (
        <div className="text-center py-4">
          <div className="w-6 h-6 border-2 border-custom-purple border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : error ? (
        <Alert className="bg-red-500/20 border-red-500">
          <AlertDescription className="text-white">{error}</AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-2">
          {logs.map(log => (
            <div 
              key={log.id}
              className="bg-gray-800 rounded-lg p-3 flex items-start justify-between"
            >
              <div>
                <div className="text-white">{formatActivity(log)}</div>
                <div className="text-sm text-gray-400">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
                {log.details && (
                  <div className="text-sm text-gray-400 mt-1">
                    {JSON.stringify(log.details)}
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {log.ipAddress}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityLogViewer;