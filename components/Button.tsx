import React from 'react';

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
};

export default function Button({ children, onClick, type = 'button', disabled = false, className }: Props) {
  // Make the button centered by default: full width on small screens, half width on
  // larger screens, and horizontally centered via mx-auto. Use flex to center
  // the content inside the button.
  const base =
    'w-full sm:w-1/2 block mx-auto flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const defaultVariant = 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
  const classes = `${base} ${className ?? defaultVariant}`;

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
