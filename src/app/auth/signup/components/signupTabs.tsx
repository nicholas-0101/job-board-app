"use client";
interface TabsProps {
  tab: "seeker" | "admin";
  setTab: (tab: "seeker" | "admin") => void;
}

export default function Tabs({ tab, setTab }: TabsProps) {
  return (
    <div className="flex mb-4 sm:mb-6">
      <button
        type="button"
        onClick={() => setTab("seeker")}
        className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-t-xl transition-colors ${
          tab === "seeker"
            ? "border-b-2 border-[#467EC7] text-[#467EC7]"
            : "text-muted-foreground hover:text-[#467EC7]"
        }`}
      >
        Job Seeker
      </button>
      <button
        type="button"
        onClick={() => setTab("admin")}
        className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-t-xl transition-colors ${
          tab === "admin"
            ? "border-b-2 border-[#467EC7] text-[#467EC7]"
            : "text-muted-foreground hover:text-[#467EC7]"
        }`}
      >
        Company Admin
      </button>
    </div>
  );
}