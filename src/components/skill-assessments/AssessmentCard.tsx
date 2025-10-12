import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Clock, Users, ChevronRight } from "lucide-react";
import { Assessment } from "@/types/skillAssessment";

interface AssessmentCardProps {
  assessment: Assessment;
  onTakeAssessment: (id: number) => void;
}

// Helper functions (max 15 lines each)
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getBadgeColor = (category?: string): string => {
  switch (category?.toLowerCase()) {
    case "frontend":
      return "bg-blue-100 text-blue-800";
    case "backend":
      return "bg-green-100 text-green-800";
    case "fullstack":
      return "bg-purple-100 text-purple-800";
    case "mobile":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const AssessmentHeader = ({ assessment }: { assessment: Assessment }) => (
  <CardHeader className="pb-4">
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <CardTitle className="text-lg font-semibold text-gray-900 leading-tight flex-1">
          {assessment.title}
        </CardTitle>
        {assessment.badgeTemplate && (
          <Badge
            className={`shrink-0 ${getBadgeColor(
              assessment.badgeTemplate.category
            )}`}
          >
            <Award className="w-3 h-3 mr-1" />
            {assessment.badgeTemplate.name}
          </Badge>
        )}
      </div>
      {assessment.description && (
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {assessment.description}
        </p>
      )}
    </div>
  </CardHeader>
);

const AssessmentStats = ({ assessment }: { assessment: Assessment }) => (
  <div className="flex items-center justify-between text-sm text-gray-600 mb-5">
    <div className="flex items-center gap-1">
      <Clock className="w-4 h-4 text-gray-500" />
      <span className="font-medium">30 min</span>
    </div>
    <div className="flex items-center gap-1">
      <Users className="w-4 h-4 text-gray-500" />
      <span className="font-medium">{assessment._count.results} taken</span>
    </div>
    <div className="flex items-center gap-1">
      <Award className="w-4 h-4 text-gray-500" />
      <span className="font-medium">
        {assessment._count.questions} questions
      </span>
    </div>
  </div>
);

const AssessmentFooter = ({
  assessment,
  onTakeAssessment,
}: {
  assessment: Assessment;
  onTakeAssessment: (id: number) => void;
}) => (
  <div className="pt-4 border-t border-gray-200">
    <div className="flex items-center justify-between gap-3">
      <div className="text-xs text-gray-500 leading-relaxed min-w-0 flex-1">
        <span className="block">Created by {assessment.creator.name}</span>
        <span className="block">{formatDate(assessment.createdAt)}</span>
      </div>
      <Button
        onClick={() => onTakeAssessment(assessment.id)}
        className="bg-[#467EC7] hover:bg-[#467EC7]/90 text-white shrink-0"
        size="sm"
      >
        Take Assessment
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  </div>
);

export default function AssessmentCard({
  assessment,
  onTakeAssessment,
}: AssessmentCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200 bg-white border border-gray-200 flex flex-col">
      <AssessmentHeader assessment={assessment} />
      <CardContent className="flex-1 flex flex-col justify-between">
        <AssessmentStats assessment={assessment} />
        <AssessmentFooter
          assessment={assessment}
          onTakeAssessment={onTakeAssessment}
        />
      </CardContent>
    </Card>
  );
}
