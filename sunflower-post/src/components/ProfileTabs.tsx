"use client";

export type ProfileTab = 'overview' | 'activity' | 'saved' | 'journals' | 'lists';

type ProfileTabsProps = {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  isOwnProfile: boolean;
};

export default function ProfileTabs({ activeTab, onTabChange, isOwnProfile }: ProfileTabsProps) {
  const tabs: { id: ProfileTab; label: string; privateTab?: boolean }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'activity', label: 'Activity' },
    { id: 'saved', label: 'Saved', privateTab: true },
    { id: 'journals', label: 'Journals', privateTab: true },
    { id: 'lists', label: 'Lists' },
  ];

  // Filter out private tabs if viewing someone else's profile
  const visibleTabs = isOwnProfile ? tabs : tabs.filter(tab => !tab.privateTab);

  return (
    <div className="border-b border-yellow-200/60">
      <div className="flex gap-1 overflow-x-auto">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-3 text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'text-yellow-900 border-b-2 border-yellow-500'
                : 'text-[#A08960] hover:text-[#7A674C] hover:bg-yellow-50/50'
            }`}
          >
            {tab.label}
            {tab.privateTab && isOwnProfile && (
              <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                Private
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
