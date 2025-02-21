import { ReactNode } from 'react';
import { useBreakpoint } from '@/hooks/useBreakpoint';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveContainer({ children, className = '' }: ResponsiveContainerProps) {
  const breakpoint = useBreakpoint();

  const containerClasses = {
    sm: 'px-4',
    md: 'px-6',
    lg: 'px-8 max-w-7xl mx-auto',
    xl: 'px-8 max-w-7xl mx-auto',
    '2xl': 'px-8 max-w-7xl mx-auto',
  };

  return (
    <div className={`${containerClasses[breakpoint]} ${className}`}>
      {children}
    </div>
  );
} 