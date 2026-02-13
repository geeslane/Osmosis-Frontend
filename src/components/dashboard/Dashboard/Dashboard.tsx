'use client';
import Animated from '@/components/common/Animation';
import Teenager from '@/components/dashboard/Dashboard/Teenager';
import WelcomeNote from '@/components/dashboard/Dashboard/WelcomeNote';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Sechedules from './Sechedules';

export default function Dashboard() {
  const pathname = usePathname();

  return (
    <Animated
      activeKey={pathname}
      className="relative space-y-[56px] py-[38px] pr-[58px]"
    >
      <WelcomeNote />
      <div className="w-full">
        <Image
          src={'/image/Artboard1.png'}
          alt="image"
          width={400}
          height={400}
          className="absolute top-20 right-20"
        />
      </div>

      <Teenager />

      <Sechedules />
    </Animated>
  );
}
