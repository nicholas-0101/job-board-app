"use client";
import { PreselectionTestDTO } from "@/lib/preselection";

interface TestHeaderProps {
  test: PreselectionTestDTO;
  answers: Record<number, string>;
}

export function TestHeader({ test, answers }: TestHeaderProps) {
  return (
    <div className="bg-background/80 backdrop-blur border-b border-gray-200 sticky top-16">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#467EC7]">
              Pre-Selection Test
            </h1>
            <p className="text-gray-600">
              Complete this test to proceed with your job application
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Progress</div>
            <div className="text-lg font-bold text-[#467EC7]">
              {Object.keys(answers).length} / {test.questions.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
