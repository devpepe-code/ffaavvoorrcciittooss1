import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-[#FF6B35] text-white hover:bg-[#e55a25] shadow-sm hover:-translate-y-px hover:shadow-md',
      destructive: 'bg-red-600 text-white hover:bg-red-700',
      outline: 'border-2 border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white',
      secondary: 'bg-[#2EC4B6] text-white hover:bg-[#27a99e]',
      ghost: 'hover:bg-[#F7F3EE] text-[#6B7280] hover:text-[#1A1A2E]',
      link: 'text-[#FF6B35] underline-offset-4 hover:underline',
    };
    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 px-3 text-sm',
      lg: 'h-12 px-8 text-lg',
      icon: 'h-10 w-10',
    };
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2',
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
export { Button };
