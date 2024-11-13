import React from 'react';
import { AlertCircle, CheckCircle, XCircle, InfoIcon } from 'lucide-react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'error' | 'warning';
  className?: string;
}

interface AlertDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const Alert = ({ children, variant = 'default', className = '' }: AlertProps) => {
  const variants = {
    default: 'bg-custom-purple/20 border-custom-purple text-white',
    success: 'bg-custom-green/20 border-custom-green text-white',
    error: 'bg-red-500/20 border-red-500 text-white',
    warning: 'bg-yellow-500/20 border-yellow-500 text-white'
  };

  const icons = {
    default: InfoIcon,
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle
  };

  const Icon = icons[variant];

  return (
    <div
      role="alert"
      className={`relative w-full rounded-lg border p-4 ${variants[variant]} ${className}`}
    >
      <div className="flex items-start gap-4">
        <Icon className="h-5 w-5" />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

const AlertDescription = ({ children, className = '' }: AlertDescriptionProps) => {
  return (
    <div className={`text-sm [&_p]:leading-relaxed ${className}`}>
      {children}
    </div>
  );
};

export { Alert, AlertDescription };