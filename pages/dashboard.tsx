import { useEffect, useState } from 'react';
import { Shield, FileText, GraduationCap, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DashboardProps {
  user: {
    username: string;
    subscriptionTier: string;
  };
}

export default function Dashboard({ user }: DashboardProps) {
  const [stats, setStats] = useState({
    documents: 0,
    completedTraining: 0,
    pendingTraining: 0,
    shieldInteractions: 0
  });

  useEffect(() => {
    // Fetch dashboard stats
    // This would be replaced with actual API calls
    setStats({
      documents: 45,
      completedTraining: 12,
      pendingTraining: 3,
      shieldInteractions: 156
    });
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.username}
          </h1>
          <p className="text-gray-400">
            Here's an overview of your QHSE management system
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Subscription Tier</div>
          <div className="text-lg font-medium text-custom-purple">
            {user.subscriptionTier.charAt(0).toUpperCase() + user.subscriptionTier.slice(1)}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Documents
            </CardTitle>
            <FileText className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.documents}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Completed Training
            </CardTitle>
            <CheckCircle className="w-4 h-4 text-custom-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.completedTraining}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Pending Training
            </CardTitle>
            <AlertCircle className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.pendingTraining}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              SHIELD Interactions
            </CardTitle>
            <Shield className="w-4 h-4 text-custom-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.shieldInteractions}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <button className="w-full bg-custom-purple text-white rounded-lg px-4 py-2 hover:bg-opacity-80 transition-colors flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Ask SHIELD
            </button>
            <button className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 hover:bg-opacity-80 transition-colors flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Upload Document
            </button>
            <button className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 hover:bg-opacity-80 transition-colors flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Start Training
            </button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <Alert className="bg-custom-purple/20 border-custom-purple">
                <AlertDescription className="text-white">
                  New SHIELD features available
                </AlertDescription>
              </Alert>
              <Alert className="bg-custom-green/20 border-custom-green">
                <AlertDescription className="text-white">
                  Training module completed
                </AlertDescription>
              </Alert>
              <Alert className="bg-yellow-500/20 border-yellow-500">
                <AlertDescription className="text-white">
                  Document review pending
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}