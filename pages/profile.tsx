import React, { useState, useEffect } from 'react';
import { 
  User,
  Mail, 
  Key,
  Bell,
  Shield,
  Clock,
  Smartphone,
  Globe,
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProfileSettings {
  email: string;
  phoneNumber: string;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    browser: boolean;
  };
  timezone: string;
  language: string;
  twoFactorEnabled: boolean;
}

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [settings, setSettings] = useState<ProfileSettings>({
    email: '',
    phoneNumber: '',
    notificationPreferences: {
      email: true,
      sms: false,
      browser: true
    },
    timezone: 'Europe/London',
    language: 'en',
    twoFactorEnabled: false
  });

  useEffect(() => {
    fetchProfileSettings();
  }, []);

  const fetchProfileSettings = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch profile settings');

      const data = await response.json();
      setSettings(data);
    } catch (error) {
      setError('Failed to load profile settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) throw new Error('Failed to update profile');

      setSuccessMessage('Profile settings updated successfully');
    } catch (error) {
      setError('Failed to save profile settings');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    // Implement password change functionality
  };

  const handle2FAToggle = async () => {
    // Implement 2FA toggle functionality
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-custom-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
          <User className="w-8 h-8" />
          Profile Settings
        </h1>

        {error && (
          <Alert className="mb-6 bg-red-500/20 border-red-500">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription className="text-white ml-2">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="mb-6 bg-custom-green/20 border-custom-green">
            <CheckCircle className="w-4 h-4" />
            <AlertDescription className="text-white ml-2">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Contact Information */}
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={e => setSettings(prev => ({ ...prev, email: e.target.value }))}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-purple"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={settings.phoneNumber}
                onChange={e => setSettings(prev => ({ ...prev, phoneNumber: e.target.value }))}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-purple"
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <button
              onClick={handlePasswordChange}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 hover:bg-gray-600 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Change Password
              </div>
              <span className="text-gray-400">•••••••</span>
            </button>

            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <div>
                  <div className="text-white">Two-Factor Authentication</div>
                  <div className="text-sm text-gray-400">
                    Add an extra layer of security to your account
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.twoFactorEnabled}
                  onChange={() => handle2FAToggle()}
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-custom-purple rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-custom-purple"></div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span className="text-white">Email Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.notificationPreferences.email}
                  onChange={e => setSettings(prev => ({
                    ...prev,
                    notificationPreferences: {
                      ...prev.notificationPreferences,
                      email: e.target.checked
                    }
                  }))}
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-custom-purple rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-custom-purple"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                <span className="text-white">SMS Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.notificationPreferences.sms}
                  onChange={e => setSettings(prev => ({
                    ...prev,
                    notificationPreferences: {
                      ...prev.notificationPreferences,
                      sms: e.target.checked
                    }
                  }))}
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-custom-purple rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-custom-purple"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                <span className="text-white">Browser Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.notificationPreferences.browser}
                  onChange={e => setSettings(prev => ({
                    ...prev,
                    notificationPreferences: {
                      ...prev.notificationPreferences,
                      browser: e.target.checked
                    }
                  }))}
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-custom-purple rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-custom-purple"></div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Regional Settings */}
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Regional Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={e => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-purple"
              >
                <option value="Europe/London">London (GMT/BST)</option>
                <option value="Europe/Paris">Paris (CET/CEST)</option>
                <option value="America/New_York">New York (EST/EDT)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Language
              </label>
              <select
                value={settings.language}
                onChange={e => setSettings(prev => ({ ...prev, language: e.target.value }))}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-purple"
              >
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-custom-purple text-white px-6 py-2 rounded-lg hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;