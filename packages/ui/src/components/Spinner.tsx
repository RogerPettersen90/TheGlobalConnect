import { type VariantProps, cva } from 'class-variance-authority';
import { type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

const spinnerVariants = cva('animate-spin rounded-full border-2 border-gray-300', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      default: 'h-6 w-6',
      lg: 'h-8 w-8',
    },
    variant: {
      default: 'border-t-gray-900',
      primary: 'border-t-blue-600',
      white: 'border-t-white',
    },
  },
  defaultVariants: {
    size: 'default',
    variant: 'default',
  },
});

export interface SpinnerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {}

export function Spinner({ className, size, variant, ...props }: SpinnerProps) {
  return (
    <div
      className={cn(spinnerVariants({ size, variant, className }))}
      {...props}
    />
  );
}