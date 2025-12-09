import React, { ReactNode } from 'react';

interface CardsProps {
  children: ReactNode;
  className?: string;
}

export default function Cards({ children, className = '' }: CardsProps) {
  return (
    <div className={` ${className} border-[1.5px] rounded-2xl p-4 `}>
      {children}
    </div>
  );
}
