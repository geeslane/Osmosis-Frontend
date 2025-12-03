'use client';

import { LoadingIcon } from '@/assets/icons';
import { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | '';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  variant?: Variant;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export default function Button({
  children,
  isLoading,
  variant,
  fullWidth,
  className = '',
  disabled,
  leftIcon,
  rightIcon,
  ...rest
}: ButtonProps) {
  const base =
    'flex items-center justify-center rounded-md text-sm font-medium transition';

  const variantClass =
    variant === 'primary'
      ? 'bg-black-100 flex items-center font-semibold text-white hover:bg-[#1c1b1b]'
      : variant === 'secondary'
      ? 'bg-gray-100 flex items-center text-gray-800 hover:bg-gray-200'
      : variant === 'outline'
      ? 'text-black-100 flex items-center font-semibold dark:text-white '
      : 'border text-gray-100 bg-gray-200 flex items-center ';

  const disabledClass =
    isLoading || disabled ? ' cursor-not-allowed text-gray-100' : '';
  const widthClass = fullWidth ? 'w-full' : '';
  const paddingClass =
    className.includes('px-') || className.includes('py-') ? '' : 'px-4 py-2';
  const allClasses =
    `${className} ${base} ${variantClass} ${paddingClass} ${widthClass} ${disabledClass} `.trim();

  return (
    <button className={allClasses} disabled={isLoading || disabled} {...rest}>
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      {isLoading && (
        <span className="me-2">
          <LoadingIcon height="18" width="18" />
        </span>
      )}
    </button>
  );
}
