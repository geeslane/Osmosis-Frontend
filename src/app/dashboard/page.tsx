import PageTitle from '@/components/PageTitle';
import Header from '@/layout/dashboard/Header';
import React from 'react';

export default function page() {
  return (
    <div>
      <PageTitle title="Dashboard" />
      <Header Heading="My Files" />
      Hello
    </div>
  );
}
