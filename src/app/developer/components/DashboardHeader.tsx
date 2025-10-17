import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DashboardHeaderProps {
  onCreateAssessment?: () => void;
}

export function DashboardHeader({ onCreateAssessment }: DashboardHeaderProps) {
  return (
    <div
      className="bg-white shadow-lg rounded-lg"
      style={{ borderColor: "#E1F1F3" }}
    >
      <div className="px-6 py-8">
        <div className="flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
          <div className="w-full sm:w-auto text-center sm:text-left">
            <h1 className="text-3xl font-bold text-[#467EC7]">
              Developer Dashboard
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Manage skill assessments, subscription approvals, and system
              configurations
            </p>
          </div>
          <div className="flex gap-3 flex-wrap w-full sm:w-auto justify-center sm:justify-end">
            <Button
              className="text-white w-full sm:w-auto"
              style={{ backgroundColor: "#467EC7" }}
              onClick={onCreateAssessment}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Assessment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

