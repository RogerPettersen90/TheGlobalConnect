import { type VariantProps, cva } from 'class-variance-authority';
import { type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

const toastVariants = cva(
  'fixed bottom-4 right-4 z-50 min-w-[300px] rounded-lg border p-4 shadow-lg',
  {
    variants: {
      variant: {
        default: 'bg-white text-gray-900 border-gray-200',
        destructive: 'bg-red-50 text-red-900 border-red-200',
        success: 'bg-green-50 text-green-900 border-green-200',
        warning: 'bg-yellow-50 text-yellow-900 border-yellow-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ToastProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  title?: string;
  description?: string;
}

export function Toast({ className, variant, title, description, ...props }: ToastProps) {
  return (
    <div className={cn(toastVariants({ variant }), className)} {...props}>
      {title && (
        <div className="font-semibold mb-1">{title}</div>
      )}
      {description && (
        <div className="text-sm opacity-90">{description}</div>
      )}
    </div>
  );
}