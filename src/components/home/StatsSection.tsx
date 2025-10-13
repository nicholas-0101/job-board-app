"use client";

import { Briefcase, Users, Building2, Award } from "lucide-react";
import { AnimatedCounter } from "../ui/AnimatedCounter";

const stats = [
  { label: "Active Jobs", value: 12340, icon: Briefcase },
  { label: "Companies", value: 7480, icon: Building2 },
  { label: "Job Seekers", value: 62500, icon: Users },
  { label: "Success Rate", value: 96, icon: Award, suffix: "%" },
];

export default function StatsSection() {
  return (
    <div className="grid grid-cols-2 sm:flex sm:justify-center gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-14">
      {stats.map((stat, i) => (
        <div key={i} className="text-center">
          <div className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#467EC7]">
            <AnimatedCounter end={stat.value} suffix={stat.suffix} />
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
