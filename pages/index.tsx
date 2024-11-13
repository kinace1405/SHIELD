import { useState } from 'react';
import { Shield, FileText, GraduationCap, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const features = [
    {
      icon: Shield,
      title: 'SHIELD AI Assistant',
      description: 'Advanced AI assistance for all your QHSE needs'
    },
    {
      icon: FileText,
      title: 'Document Management',
      description: 'Secure storage and intelligent processing of QHSE documentation'
    },
    {
      icon: GraduationCap,
      title: 'Training Management',
      description: 'Comprehensive training modules and certification tracking'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-custom-purple">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Welcome to Senator Safety
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Your comprehensive QHSE management solution powered by advanced AI technology
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="/register"
                className="bg-custom-purple text-white px-6 py-3 rounded-lg hover:bg-opacity-80 transition-colors inline-flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/login"
                className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-opacity-80 transition-colors"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Our Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <feature.icon className="w-12 h-12 text-custom-purple mb-4" />
                <CardTitle className="text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-custom-purple/20 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your QHSE Management?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join leading organisations in streamlining their QHSE processes with Senator Safety
          </p>
          <a
            href="/register"
            className="bg-custom-green text-white px-8 py-4 rounded-lg hover:bg-opacity-80 transition-colors inline-flex items-center gap-2 text-lg"
          >
            Start Your Journey
            <ArrowRight className="w-6 h-6" />
          </a>
        </div>
      </div>
    </div>
  );
}