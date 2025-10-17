import { StatCard } from "./StatCard";
import { STAT_CONFIGS } from "../constants/dashboardConfig";
import type { DeveloperStats } from "../hooks/useDeveloperStats";

interface StatsSectionProps {
  stats: DeveloperStats;
  isLoading: boolean;
}

export function StatsSection({ stats, isLoading }: StatsSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {STAT_CONFIGS.map((config) => {
        const value = stats[config.key] || 0;
        const formattedValue = config.formatter
          ? config.formatter(value)
          : value;

        return (
          <StatCard
            key={config.key}
            title={config.title}
            value={formattedValue}
            description={config.description}
            icon={config.icon}
            iconBgColor={config.iconBgColor}
            isLoading={isLoading}
          />
        );
      })}
    </div>
  );
}
