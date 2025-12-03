import React from "react";
import Image from "next/image";
import Link from "next/link";

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
            <Link href="/">
            <Image  src="/authImages/logo1.png" alt="FOJO Logo" width={64} height={40} />
            </Link>
          </div>
          <div className="absolute bottom-0 left-0 w-full px-9 pb-10 text-white z-10">
            <h3 className="font-bold text-[60px] -tracking-tighter leading-[70px] uppercase">
              begin your walk with Jesus today.
            </h3>
            <p className="text-start lora italic font-normal text-[22px]">
              “Come, follow me, and I will make you fishers of men.”
            </p>
            <p className="text-start lora font-normal text-[22px]">— Matthew 4:19 (NIV)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
