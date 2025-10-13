"use client";
import { Button } from "@/components/ui/button";
import { BookOpen, Target } from "lucide-react";
import Link from "next/link";

export default function DashboardHeader() {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Assessment Dashboard
          </h1>
          <p className="text-gray-600">
            Track your progress and manage your skill assessment results
          </p>
        </div>
        
        <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
          <Link href="/skill-assessments">
            <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
              <BookOpen className="w-4 h-4" />
              Browse Assessments
            </Button>
          </Link>
          
          <Button className="flex items-center gap-2 bg-[#467EC7] hover:bg-[#467EC7]/90 w-full sm:w-auto">
            <Target className="w-4 h-4" />
            Take Assessment
          </Button>
        </div>
      </div>
    </div>
  );
}
