import { useState } from "react";

interface BadgeIconProps {
  icon?: string;
  name: string;
  earned: boolean;
}

export default function BadgeIcon({ icon, name, earned }: BadgeIconProps) {
  const [imageError, setImageError] = useState(false);

  const isImageUrl = icon && icon.startsWith('http');
  const shouldShowImage = isImageUrl && !imageError;

  return (
    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl ${
      earned ? "bg-[#24CFA7]/20" : "bg-gray-200"
    }`}>
      {shouldShowImage ? (
        <img 
          src={icon} 
          alt={name}
          className="w-12 h-12 rounded-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="text-2xl">
          {icon && !isImageUrl ? icon : "🏆"}
        </span>
      )}
    </div>
  );
}
