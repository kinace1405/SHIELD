import { AlertTriangle } from 'lucide-react';

export default function Custom500() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-custom-purple flex flex-col items-center justify-center p-4">
      <AlertTriangle className="w-24 h-24 text-custom-purple mb-8 animate-pulse" />
      <h1 className="text-4xl font-bold text-white mb-4">500 - Server Error</h1>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        Something went wrong on our end. Please try again later.
      </p>
      <a
        href="/"
        className="bg-custom-purple text-white px-6 py-3 rounded-lg hover:bg-opacity-80 transition-colors"
      >
        Return Home
      </a>
    </div>
  );
}