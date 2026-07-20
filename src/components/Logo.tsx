import { cn } from '@/lib/utils';
import React from 'react';
import logoImage from '@/assets/logo.png';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ className, variant = 'dark', size = 'md' }) => {
  const isLight = variant === 'light';

  const sizeClasses = {
    sm: { icon: 'w-8 h-8', text: 'text-lg' },
    md: { icon: 'w-10 h-10', text: 'text-xl' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl' },
    xl: { icon: 'w-16 h-16', text: 'text-4xl' },
  };

  const { icon, text } = sizeClasses[size];

  const logoMark = (
    <div
      className={cn(
        "relative flex-shrink-0 flex items-center justify-center",
        icon,
        isLight && "bg-white rounded-full p-1 shadow-sm"
      )}
    >
      <img src={logoImage} alt="Market Mirror" className="w-full h-full object-contain" />
    </div>
  );

  if (variant === 'icon') {
    return <div className={cn(className)}>{logoMark}</div>;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {logoMark}
      <span className={cn(
        "font-display font-bold tracking-tight",
        text,
        isLight ? "text-white" : "text-secondary"
      )}>
        Market Mirror
      </span>
    </div>
  );
};