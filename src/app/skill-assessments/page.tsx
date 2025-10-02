"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Clock, Users, ChevronRight, Trophy, BookOpen } from "lucide-react";
import { getAssessments } from "@/lib/skillAssessment";
import toast from "react-hot-toast";

interface Assessment {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  badgeTemplate?: {
    id: number;
    name: string;
    icon?: string;
    category?: string;
  };
  creator: {
    id: number;
    name: string;
  };
  _count: {
    results: number;
    questions: number;
  };
}

export default function SkillAssessmentsPage() {
  const router = useRouter();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const response = await getAssessments(page, 10);
      
      if (response.data.assessments) {
        setAssessments(response.data.assessments);
        setHasMore(response.data.pagination.hasNext);
      }
    } catch (error: any) {
      console.error("Error fetching assessments:", error);
      toast.error("Failed to load skill assessments");
    } finally {
      setLoading(false);
    }
  };

  const handleTakeAssessment = (assessmentId: number) => {
    router.push(`/skill-assessments/${assessmentId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Skill Assessments</h1>
              <p className="text-gray-600 mt-1">
                Test your skills and earn certificates to showcase your expertise
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Available Tests</p>
                    <p className="text-2xl font-bold text-gray-900">{assessments.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Participants</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {assessments.reduce((sum, a) => sum + a._count.results, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">Certificates Available</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {assessments.filter(a => a.badgeTemplate).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Assessments Grid */}
        {assessments.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Assessments Available
              </h3>
              <p className="text-gray-600">
                Check back later for new skill assessments to test your abilities.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map((assessment) => (
              <Card key={assessment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{assessment.title}</CardTitle>
                      {assessment.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {assessment.description}
                        </p>
                      )}
                    </div>
                    {assessment.badgeTemplate && (
                      <div className="ml-3">
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          <Trophy className="w-3 h-3 mr-1" />
                          Certificate
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Badge Info */}
                    {assessment.badgeTemplate && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">
                            Earn: {assessment.badgeTemplate.name}
                          </span>
                        </div>
                        {assessment.badgeTemplate.category && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            {assessment.badgeTemplate.category}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{assessment._count.results} taken</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{assessment._count.questions} questions</span>
                      </div>
                    </div>
                    
                    {/* Creator */}
                    <div className="text-xs text-gray-500">
                      Created by {assessment.creator.name}
                    </div>
                    
                    {/* Action Button */}
                    <Button 
                      onClick={() => handleTakeAssessment(assessment.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Take Assessment
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
