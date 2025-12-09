import React from 'react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 gap-28 cormorant-garamond bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex lg:flex-row-reverse w-full h-screen justify-center flex-col sm:p-0">
        {children}
        <div className="lg:w-1/2 w-full h-full relative hidden lg:block">
          <div className="absolute inset-0 authbg" />
          <div className="absolute inset-0 bg-black/20 z-0" />
          <div className="absolute top-8 left-8 z-10">
            <Link href="/"></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
