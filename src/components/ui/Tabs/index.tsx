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
  preserveSearchParams?: boolean;
  containerClassName?: string;
};
const Tabs: React.FC<TabsProps> = ({
  tabs,
  paramKey = 'tab',
  defaultValue,
  preserveSearchParams = false,
  containerClassName = 'max-w-[350px]',
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get(paramKey) || defaultValue || tabs[0].value;

  const handleChange = (value: string) => {
    const params = preserveSearchParams
      ? new URLSearchParams(searchParams.toString())
      : new URLSearchParams();

    params.set(paramKey, value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div
      className={clsx(
        'flex gap-6 border-b border-gray-200 overflow-x-auto scrollbar-hide overflow-y-hidden',
        containerClassName
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === activeTab;

        return (
          <button
            key={tab.value}
            onClick={() => handleChange(tab.value)}
            className={clsx(
              'relative flex shrink-0 items-center gap-2 pb-3  font-medium transition-colors whitespace-nowrap',
              isActive ? 'text-green-100' : 'text-green-200'
            )}
          >
            {tab.icon && (
              <span
                className={clsx(
                  isActive ? 'text-green-600' : 'hidden text-gray-400'
                )}
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
