'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';

export type TabItem = {
  title: string;
  value: string;
  icon?: React.ReactNode;
};

type TabsProps = {
  tabs: TabItem[];
  paramKey?: string;
  defaultValue?: string;
};

const Tabs: React.FC<TabsProps> = ({
  tabs,
  paramKey = 'tab',
  defaultValue,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get(paramKey) || defaultValue || tabs[0].value;

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramKey, value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex gap-8 border-b border-gray-200 max-w-[300px]">
      {tabs.map((tab) => {
        const isActive = tab.value === activeTab;

        return (
          <button
            key={tab.value}
            onClick={() => handleChange(tab.value)}
            className={clsx(
              'relative flex items-center gap-2 pb-3 text-base font-medium transition-colors',
              isActive ? 'text-green-100' : 'text-green-200'
            )}
          >
            {tab.icon && (
              <span
                className={isActive ? 'text-green-600' : 'text-gray-400 hidden'}
              >
                {tab.icon}
              </span>
            )}

            {tab.title}

            <span
              className={clsx(
                'pointer-events-none absolute left-0 -bottom-[1px] h-[2px] w-full rounded-full transition-opacity',
                isActive ? 'bg-green-100 opacity-100' : 'opacity-0'
              )}
            />
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
