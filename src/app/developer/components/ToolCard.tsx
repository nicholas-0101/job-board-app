import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type LucideIcon } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconBgColor: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export function ToolCard({
  title,
  description,
  icon: Icon,
  iconBgColor,
  buttonText,
  onButtonClick,
}: ToolCardProps) {
  return (
    <Card
      className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 group"
      style={{ borderColor: "#E1F1F3" }}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: iconBgColor }}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#467EC7] transition-colors duration-300">
                {title}
              </h3>
              <p className="text-gray-600 text-sm">{description}</p>
            </div>
          </div>
          <Button
            size="sm"
            className="text-white"
            style={{ backgroundColor: "#467EC7" }}
            onClick={onButtonClick}
          >
            {buttonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

