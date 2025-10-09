import { Badge } from "../types";
import BadgeCard from "./BadgeCard";

interface BadgeGridProps {
  badges: Badge[];
}

export default function BadgeGrid({ badges }: BadgeGridProps) {
  if (badges.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-4xl">🏆</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Badges Yet</h3>
        <p className="text-gray-600 mb-6">
          Complete skill assessments to earn your first badge!
        </p>
        <a 
          href="/skill-assessments"
          className="inline-flex items-center px-6 py-3 bg-[#467EC7] text-white rounded-lg hover:bg-[#467EC7]/90 transition-colors"
        >
          Take Assessment
        </a>
      </div>
    );
  }

  // Separate earned and unearned badges
  const earnedBadges = badges.filter(badge => badge.earned);
  const unearnedBadges = badges.filter(badge => !badge.earned);

  return (
    <div className="space-y-8">
      {earnedBadges.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            Earned Badges ({earnedBadges.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {earnedBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      )}

      {unearnedBadges.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">⏳</span>
            Available Badges ({unearnedBadges.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {unearnedBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
