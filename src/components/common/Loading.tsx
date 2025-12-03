'use client';
import Image from 'next/image';
import Link from 'next/link';

const Loading = () => {
    return (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
            <div className="w-12 h-12">
                <Link href="/">
                    <Image
                        src="/images/home/logo.png"
                        alt="FOJO Logo"
                        width={90}
                        height={40}
                        className="object-contain mx-auto md:mx-0"
                    />
                </Link>
            </div>
        </div>
    );
}

export default Loading