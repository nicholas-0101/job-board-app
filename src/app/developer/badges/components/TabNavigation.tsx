"use client";

interface TabNavigationProps {
  activeTab: "badges" | "certificates";
  setActiveTab: (tab: "badges" | "certificates") => void;
  badgesCount: number;
  certificatesCount: number;
}

export function TabNavigation({ activeTab, setActiveTab, badgesCount, certificatesCount }: TabNavigationProps) {
  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
      <button
        onClick={() => setActiveTab("badges")}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          activeTab === "badges"
            ? "bg-white text-[#467EC7] shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Badge Templates ({badgesCount})
      </button>
      <button
        onClick={() => setActiveTab("certificates")}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          activeTab === "certificates"
            ? "bg-white text-[#467EC7] shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Issued Certificates ({certificatesCount})
      </button>
    </div>
  );
}
