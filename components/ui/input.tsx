import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, type = 'text', ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      'w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm transition-all placeholder:text-neutral-400 focus:border-neutral-400 focus:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2',
      className,
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export { Input };
