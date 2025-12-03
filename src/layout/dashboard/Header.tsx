import Link from 'next/link';

interface HeaderProps {
  Heading: string;
  link?: string;
}
export default function Header({ Heading, link = '#' }: HeaderProps) {
  return (
    <div className="font-lora text-[20px] lg:text-[28px] font-semibold dark:text-white text-gray-800">
      <Link href={link}>
        <h3>{Heading}</h3>
      </Link>
    </div>
  );
}
