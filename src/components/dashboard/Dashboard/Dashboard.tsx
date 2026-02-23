'use client';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function Dashboard() {
  // const user = useSelector((state: RootState) => state.profile.user);
  return (
    <div>Dashboard</div>
    // <Animated
    //   activeKey={pathname}
    //   className="relative space-y-[56px] py-[38px] md:pr-[58px]"
    // >
    //   <WelcomeNote />
    //   <div className="w-full">
    //     <Image
    //       src={'/image/Artboard1.png'}
    //       alt="image"
    //       width={400}
    //       height={400}
    //       className="absolute top-20 right-20"
    //     />
    //   </div>
    //   {role ? <Admins /> : <Teenager />}

    //   <Sechedules />
    // </Animated>
  );
}
