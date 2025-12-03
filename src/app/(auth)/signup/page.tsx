import SignUpForm from "@/components/auth/SignUpForm";
import { generateMetadata } from "@/utils/metadata";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadata({ title: 'FOJO | Signup', url: '/signup', description: 'Create a new FOJO account to join a community of believers passionately committed to walking in the footsteps of Jesus Christ.' });

export default function SignUp() {
  return <SignUpForm />;
}
