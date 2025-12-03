'use client';

type TabId = 'account' | 'notification' | 'security';

const tabs: { id: TabId; label: string }[] = [
  { id: 'account', label: 'Account' },
  { id: 'notification', label: 'Notification' },
  { id: 'security', label: 'Security' },
];

export default function ProfileTab({
  activeTab,
  setActiveTab,
}: {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}) {
  return (
    <div className="mb-6">
      <div className="inline-flex rounded-lg bg-gray-300 p-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
