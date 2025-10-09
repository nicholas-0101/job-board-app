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
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getBadgeColor = (category?: string): string => {
  switch (category?.toLowerCase()) {
    case 'frontend': return 'bg-blue-100 text-blue-800';
    case 'backend': return 'bg-green-100 text-green-800';
    case 'fullstack': return 'bg-purple-100 text-purple-800';
    case 'mobile': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const AssessmentHeader = ({ assessment }: { assessment: Assessment }) => (
  <CardHeader className="pb-3">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
          {assessment.title}
        </CardTitle>
        {assessment.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {assessment.description}
          </p>
        )}
      </div>
      {assessment.badgeTemplate && (
        <Badge className={`ml-3 ${getBadgeColor(assessment.badgeTemplate.category)}`}>
          <Award className="w-3 h-3 mr-1" />
          {assessment.badgeTemplate.name}
        </Badge>
      )}
    </div>
  </CardHeader>
);

const AssessmentStats = ({ assessment }: { assessment: Assessment }) => (
  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
    <div className="flex items-center gap-1">
      <Clock className="w-4 h-4" />
      <span>30 min</span>
    </div>
    <div className="flex items-center gap-1">
      <Users className="w-4 h-4" />
      <span>{assessment._count.results} taken</span>
    </div>
    <div className="flex items-center gap-1">
      <Award className="w-4 h-4" />
      <span>{assessment._count.questions} questions</span>
    </div>
  </div>
);

const AssessmentFooter = ({ 
  assessment, 
  onTakeAssessment 
}: { 
  assessment: Assessment; 
  onTakeAssessment: (id: number) => void; 
}) => (
  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
    <div className="text-xs text-gray-500">
      Created by {assessment.creator.name} • {formatDate(assessment.createdAt)}
    </div>
    <Button
      onClick={() => onTakeAssessment(assessment.id)}
      className="bg-[#467EC7] hover:bg-[#467EC7]/90 text-white"
      size="sm"
    >
      Take Assessment
      <ChevronRight className="w-4 h-4 ml-1" />
    </Button>
  </div>
);

export default function AssessmentCard({ assessment, onTakeAssessment }: AssessmentCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200 bg-white border border-gray-200">
      <AssessmentHeader assessment={assessment} />
      <CardContent>
        <AssessmentStats assessment={assessment} />
        <AssessmentFooter assessment={assessment} onTakeAssessment={onTakeAssessment} />
      </CardContent>
    </Card>
  );
}
