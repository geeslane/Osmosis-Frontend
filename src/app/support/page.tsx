import Footer from "@/layout/home/Footer";
import Navbar from "@/layout/home/Navbar";
import { generateMetadata } from "@/utils/metadata";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadata({ title: 'FOJO | Support', description: 'Support FOJO - A community of believers passionately committed to walking in the footsteps of Jesus Christ.', url: '/support' });

export default function SupportPage() {
    return (
        <div className="relative h-screen w-full">
            <div
                className="absolute inset-0 bg-cover text-white bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/images/home/hero-banner.png')" }}
            >
                <div className="absolute inset-0 bg-black/40" />
            </div>
            <Navbar />
            <div className="relative z-10 h-full flex items-center justify-center">
                Support Page
            </div>
            <div className="relative z-0">
                <Footer />
            </div>
        </div>
    );
}
