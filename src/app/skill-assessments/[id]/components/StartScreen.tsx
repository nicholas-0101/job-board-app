"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Clock, AlertCircle, Trophy } from "lucide-react";

interface StartScreenProps {
  title: string;
  description?: string;
  questionCount: number;
  badgeTemplate?: {
    name: string;
    icon?: string;
    category?: string;
  };
  onStart: () => void;
}

export default function StartScreen({
  title,
  description,
  questionCount,
  badgeTemplate,
  onStart,
}: StartScreenProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-0">
          {/* Header Section with Gradient */}
          <div className="bg-gradient-to-r from-[#467EC7] to-[#24CFA7] p-8 text-white text-center rounded-t-lg">
            <div className="p-4 bg-white/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <Award className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-3">{title}</h1>
            {description && (
              <p className="text-white/90 text-lg max-w-2xl mx-auto leading-relaxed">{description}</p>
            )}
          </div>

          <div className="p-8 space-y-8">
            {/* Certificate Badge */}
            {badgeTemplate && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#24CFA7]/10 to-[#467EC7]/10 rounded-xl blur-sm"></div>
                <div className="relative p-6 bg-gradient-to-r from-[#24CFA7]/5 to-[#467EC7]/5 rounded-xl border border-[#24CFA7]/20">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#24CFA7] text-white rounded-full text-sm font-medium mb-3">
                      <Trophy className="w-4 h-4" />
                      Certificate Available
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Earn: {badgeTemplate.name}
                    </h3>
                    <p className="text-gray-600">
                      Complete this assessment with a passing score to receive your digital certificate
                    </p>
                    {badgeTemplate.category && (
                      <Badge variant="outline" className="mt-3 border-[#24CFA7] text-[#24CFA7]">
                        {badgeTemplate.category}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Assessment Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-[#467EC7]/10 rounded-lg">
                    <Clock className="w-5 h-5 text-[#467EC7]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Duration</h4>
                    <p className="text-2xl font-bold text-[#467EC7]">30 minutes</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Assessment will auto-submit when time expires
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-[#24CFA7]/10 rounded-lg">
                    <Award className="w-5 h-5 text-[#24CFA7]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Questions</h4>
                    <p className="text-2xl font-bold text-[#24CFA7]">{questionCount}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Navigate between questions freely
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-orange-900 mb-3">Important Instructions</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-orange-800">
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                        You have <strong>30 minutes</strong> to complete this assessment
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                        Navigate between questions freely
                      </li>
                    </ul>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                        Your progress is automatically saved
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                        Passing score is <strong>75%</strong>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <div className="text-center">
              <Button
                onClick={onStart}
                size="lg"
                className="px-12 py-4 bg-gradient-to-r from-[#467EC7] to-[#24CFA7] hover:from-[#467EC7]/90 hover:to-[#24CFA7]/90 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Award className="w-5 h-5 mr-2" />
                Start Assessment
              </Button>
              <p className="text-sm text-gray-500 mt-3">
                Click to begin your skill assessment journey
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
