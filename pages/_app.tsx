import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/layout';
import { useEffect, useState } from 'react';
import { log } from '../utils/logger';

interface User {
  username: string;
  subscriptionTier: string;
}

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for user session
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            localStorage.removeItem('token');
            setUser(null);
          } else {
            setUser(data);
          }
        })
        .catch(error => {
          log('error', 'Auth verification failed:', { error });
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Pages that don't need the layout
  const noLayoutPages = ['/login', '/register'];
  const shouldShowLayout = !noLayoutPages.includes(pageProps.pathname);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-purple" />
      </div>
    );
  }

  if (!shouldShowLayout) {
    return <Component {...pageProps} />;
  }

  return (
    <Layout user={user}>
      <Component {...pageProps} user={user} />
    </Layout>
  );
}

export default MyApp;