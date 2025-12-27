'use client';
import { useNavbarTitle } from '@/context/NavbarTitleContsxt';
import { useEffect } from 'react';

type PageTitleProps = {
  title: string;
};

const PageTitle = ({ title }: PageTitleProps) => {
  const { setTitle } = useNavbarTitle();

  useEffect(() => {
    setTitle(title);

    return () => {
      setTitle('');
    };
  }, [title, setTitle]);

  return null;
};

export default PageTitle;
