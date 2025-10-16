import { TestTube } from "lucide-react";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="mb-8">
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => onTabChange("job")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "job"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Job Details
        </button>
        <button
          onClick={() => onTabChange("test")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "test"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <TestTube className="w-4 h-4 inline mr-2" />
          Pre-Selection Test
        </button>
      </div>
    </div>
  );
}
