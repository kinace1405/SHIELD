import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`rounded-lg border border-gray-700 bg-gray-800/50 shadow-sm ${className}`}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

const CardTitle = ({ children, className = '' }: CardProps) => {
  return (
    <h3 className={`text-lg font-medium text-white ${className}`}>
      {children}
    </h3>
  );
};

const CardDescription = ({ children, className = '' }: CardProps) => {
  return (
    <p className={`text-sm text-gray-400 ${className}`}>
      {children}
    </p>
  );
};

const CardContent = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`flex items-center p-6 pt-0 ${className}`}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };