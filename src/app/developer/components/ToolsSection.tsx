import { useRouter } from "next/navigation";
import { ToolCard } from "./ToolCard";
import { TOOL_CONFIGS } from "../constants/dashboardConfig";

export function ToolsSection() {
  const router = useRouter();

  const handleToolClick = (route?: string) => {
    if (route) {
      router.push(route);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Developer Tools
        </h2>
      </div>

      <div className="space-y-4">
        {TOOL_CONFIGS.map((tool) => (
          <ToolCard
            key={tool.title}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            iconBgColor={tool.iconBgColor}
            buttonText={tool.buttonText}
            onButtonClick={() => handleToolClick(tool.route)}
          />
        ))}
      </div>
    </div>
  );
}

