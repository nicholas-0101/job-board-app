import { Medal } from "lucide-react";

export default function BadgeHeader() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#467EC7]/20 to-[#24CFA7]/20 rounded-full mb-6">
        <Medal className="w-10 h-10 text-[#467EC7]" />
      </div>
      
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        My Badges
      </h1>
      
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Showcase your achievements and skills earned through successful completion of skill assessments. 
        Each badge represents your expertise in different areas.
      </p>
    </div>
  );
}
