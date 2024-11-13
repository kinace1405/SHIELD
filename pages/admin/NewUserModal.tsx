// components/admin/NewUserModal.tsx
import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Shield, 
  Key, 
  CreditCard,
  Save,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface NewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}

const NewUserModal: React.FC<NewUserModalProps> = ({ isOpen, onClose, onUserCreated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user',
    subscriptionTier: 'miles',
    sendInvite: true,
    permissions: [] as string[]
  });

  const availablePermissions = [
    'document.view',
    'document.create',
    'document.edit',
    'document.delete',
    'training.view',
    'training.manage',
    'reports.view',
    'reports.create',
    'users.view',
    'users.manage'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create user');
      }

      onUserCreated();
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Create New User</CardTitle>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert className="bg-red-500/20 border-red-500">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription className="text-white ml-2">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-purple"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-purple"
                    placeholder="Enter email"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Role and Subscription */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Role
                </label>
                <div className="relative">
                  <Shield className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={formData.role}
                    onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-purple appearance-none"
                  >
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subscription Tier
                </label>
                <div className="relative">
                  <CreditCard className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={formData.subscriptionTier}
                    onChange={e => setFormData(prev => ({ ...prev, subscriptionTier: e.target.value }))}
                    className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-purple appearance-none"
                  >
                    <option value="miles">Miles</option>
                    <option value="centurion">Centurion</option>
                    <option value="tribune">Tribune</option>
                    <option value="consul">Consul</option>
                    <option value="emperor">Emperor</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Permissions
              </label>
              <div className="grid grid-cols-2 gap-2 bg-gray-700 p-4 rounded-lg">
                {availablePermissions.map(permission => (
                  <label 
                    key={permission}
                    className="flex items-center space-x-2 text-white"
                  >
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(permission)}
                      onChange={() => handlePermissionChange(permission)}
                      className="form-checkbox h-4 w-4 text-custom-purple rounded border-gray-500 bg-gray-600 focus:ring-custom-purple"
                    />
                    <span>{permission}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Send Invite Option */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.sendInvite}
                onChange={e => setFormData(prev => ({ ...prev, sendInvite: e.target.checked }))}
                className="form-checkbox h-4 w-4 text-custom-purple rounded border-gray-500 bg-gray-600 focus:ring-custom-purple"
              />
              <label className="text-white">
                Send invitation email with login instructions
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-custom-purple text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Create User
                  </>
                )}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewUserModal;