import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus,
  Edit,
  Trash2,
  Clock,
  Users,
  FileText,
  Eye,
  Upload,
  Search,
  Filter,
  AlignLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Module {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  requiredFor: string[];
  lastUpdated: string;
  status: 'active' | 'draft' | 'archived';
  completions: number;
  materials: {
    type: string;
    url: string;
    name: string;
  }[];
}

const ModulesAdmin = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNewModuleModal, setShowNewModuleModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await fetch('/api/admin/modules', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch modules');

      const data = await response.json();
      setModules(data);
    } catch (error) {
      setError('Failed to load training modules');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module?')) return;

    try {
      const response = await fetch(`/api/admin/modules/${moduleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete module');

      setModules(modules.filter(mod => mod.id !== moduleId));
    } catch (error) {
      setError('Failed to delete module');
    }
  };

  const handleStatusChange = async (moduleId: string, newStatus: Module['status']) => {
    try {
      const response = await fetch(`/api/admin/modules/${moduleId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update module status');

      setModules(modules.map(mod => 
        mod.id === moduleId ? { ...mod, status: newStatus } : mod
      ));
    } catch (error) {
      setError('Failed to update module status');
    }
  };

  const filteredModules = modules.filter(module => {
    const matchesSearch = 
      module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || module.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || module.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadgeClass = (status: Module['status']) => {
    switch (status) {
      case 'active':
        return 'bg-custom-green/20 text-custom-green border-custom-green';
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500';
      case 'archived':
        return 'bg-gray-500/20 text-gray-500 border-gray-500';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-custom-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-8 h-8" />
              Training Modules
            </h1>
            <p className="text-gray-400">
              Manage and organize your QHSE training modules
            </p>
          </div>
          <button
            onClick={() => setShowNewModuleModal(true)}
            className="bg-custom-purple text-white rounded-lg px-4 py-2 hover:bg-opacity-80 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Module
          </button>
        </div>

        {/* Filters */}
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search modules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-purple"
                  />
                </div>
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-purple"
              >
                <option value="all">All Categories</option>
                <option value="health">Health & Safety</option>
                <option value="quality">Quality Management</option>
                <option value="environmental">Environmental</option>
                <option value="compliance">Compliance</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-purple"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map(module => (
            <Card 
              key={module.id}
              className="bg-gray-800/50 border-gray-700 hover:border-custom-purple transition-colors"
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(module.status)}`}>
                    {module.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedModule(module)}
                      className="text-gray-400 hover:text-white transition-colors"
                      title="Edit Module"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteModule(module.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete Module"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <CardTitle className="text-white">
                  {module.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-400 text-sm">
                    {module.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-4 h-4" />
                      {module.duration} mins
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Users className="w-4 h-4" />
                      {module.completions} completions
                    </div>
                  </div>

                  {module.materials.length > 0 && (
                    <div>
                      <h4 className="text-white font-medium mb-2">Materials:</h4>
                      <div className="space-y-2">
                        {module.materials.map((material, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-700/50 rounded"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-300 text-sm">
                                {material.name}
                              </span>
                            </div>
                            <button
                              className="text-gray-400 hover:text-white transition-colors"
                              title="View Material"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">
                        Last updated: {new Date(module.lastUpdated).toLocaleDateString()}
                      </span>
                      <select
                        value={module.status}
                        onChange={(e) => handleStatusChange(module.id, e.target.value as Module['status'])}
                        className="bg-gray-700 text-white text-sm rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-custom-purple"
                      >
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModulesAdmin;