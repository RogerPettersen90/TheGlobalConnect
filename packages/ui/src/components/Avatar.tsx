import { forwardRef, type ImgHTMLAttributes } from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '../utils/cn';

const avatarVariants = cva(
  'inline-block rounded-full bg-gray-100 object-cover',
  {
    variants: {
      size: {
        sm: 'h-6 w-6',
        default: 'h-10 w-10',
        lg: 'h-16 w-16',
        xl: 'h-24 w-24',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface AvatarProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'size'>,
    VariantProps<typeof avatarVariants> {
  name?: string;
  fallback?: string;
}

const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, size, src, alt, name, fallback, ...props }, ref) => {
    const initials = fallback || (name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '?');
    
    if (!src) {
      return (
        <div
          className={cn(
            avatarVariants({ size }),
            'flex items-center justify-center bg-gray-300 text-gray-600 font-medium',
            className
          )}
        >
          {initials}
        </div>
      );
    }

    return (
      <img
        className={cn(avatarVariants({ size, className }))}
        src={src}
        alt={alt || name}
        ref={ref}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const fallbackDiv = document.createElement('div');
          fallbackDiv.className = cn(
            avatarVariants({ size }),
            'flex items-center justify-center bg-gray-300 text-gray-600 font-medium',
            className
          );
          fallbackDiv.textContent = initials;
          target.parentNode?.appendChild(fallbackDiv);
        }}
        {...props}
      />
    );
  }
);
Avatar.displayName = 'Avatar';

export { Avatar, avatarVariants };