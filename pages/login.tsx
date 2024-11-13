          import React, { useState } from 'react';
          import { Shield, AlertCircle } from 'lucide-react';
          import { Alert, AlertDescription } from '@/components/ui/alert';

          export default function Login() {
            const [username, setUsername] = useState('');
            const [password, setPassword] = useState('');
            const [error, setError] = useState('');
            const [loading, setLoading] = useState(false);

            const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              setError('');
              setLoading(true);

              try {
                const response = await fetch('/api/auth/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ username, password }),
                });

                const data = await response.json();

                if (response.ok) {
                  localStorage.setItem('token', data.token);
                  window.location.href = '/dashboard';
                } else {
                  setError(data.error || 'Login failed');
                }
              } catch (error) {
                setError('An error occurred. Please try again.');
              } finally {
                setLoading(false);
              }
            };

            return (
              <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-custom-purple flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md">
                  <div className="text-center mb-8">
                    <Shield className="w-12 h-12 text-custom-purple mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-400">Log in to access your QHSE management system</p>
                  </div>

                  {error && (
                    <Alert className="mb-6 bg-red-500/20 border-red-500">
                      <AlertCircle className="w-4 h-4" />
                      <AlertDescription className="text-white ml-2">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label 
                        htmlFor="username" 
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Username
                      </label>
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-purple border border-gray-700"
                        placeholder="Enter your username"
                        required
                      />
                    </div>

                    <div>
                      <label 
                        htmlFor="password" 
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Password
                      </label>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-purple border border-gray-700"
                        placeholder="Enter your password"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-custom-purple text-white rounded-lg px-4 py-2 hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        'Sign In'
                      )}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-gray-400">
                      Don't have an account?{' '}
                      <a 
                        href="/register" 
                        className="text-custom-purple hover:text-opacity-80 transition-colors"
                      >
                        Register here
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            );
          }