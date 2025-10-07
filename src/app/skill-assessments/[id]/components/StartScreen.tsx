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
    <div className="w-full">
      <Card className="shadow-lg border border-[#A3B6CE]/20 bg-white">
        <CardContent className="p-0">
          {/* Header Section with Light Background */}
          <div className="bg-[#E1F1F3] p-8 text-center rounded-t-lg border-b border-[#A3B6CE]/20">
            <div className="p-4 bg-[#467EC7]/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <Award className="w-12 h-12 text-[#467EC7]" />
            </div>
            <h1 className="text-3xl font-bold mb-3 text-gray-800">{title}</h1>
            {description && (
              <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                {description}
              </p>
            )}
          </div>

          <div className="p-8 space-y-8">
            {/* Certificate Badge */}
            {badgeTemplate && (
              <div className="relative">
                <div className="p-6 bg-[#E1F1F3]/50 rounded-xl border border-[#A3B6CE]/30">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#24CFA7] text-white rounded-full text-sm font-medium mb-3">
                      <Trophy className="w-4 h-4" />
                      Certificate Available
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Earn: {badgeTemplate.name}
                    </h3>
                    <p className="text-gray-600">
                      Complete this assessment with a passing score to receive
                      your digital certificate
                    </p>
                    {badgeTemplate.category && (
                      <Badge
                        variant="outline"
                        className="mt-3 border-[#467EC7] text-[#467EC7] bg-[#467EC7]/5"
                      >
                        {badgeTemplate.category}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Assessment Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-xl border border-[#A3B6CE]/20 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-[#467EC7]/10 rounded-lg">
                    <Clock className="w-5 h-5 text-[#467EC7]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Duration</h4>
                    <p className="text-2xl font-bold text-[#467EC7]">
                      2 minutes (Testing)
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 flex-grow">
                  Assessment will auto-submit when time expires
                </p>
              </div>

              <div className="p-6 bg-white rounded-xl border border-[#A3B6CE]/20 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-[#24CFA7]/10 rounded-lg">
                    <Award className="w-5 h-5 text-[#24CFA7]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Questions</h4>
                    <p className="text-2xl font-bold text-[#24CFA7]">
                      {questionCount}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 flex-grow">
                  Navigate between questions freely
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className="p-6 bg-[#F0F5F9] border border-[#A3B6CE]/30 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-[#467EC7]/10 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-[#467EC7]" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Important Instructions
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#467EC7] rounded-full"></div>
                        You have <strong>2 minutes</strong> to complete this
                        assessment (Testing Mode)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#467EC7] rounded-full"></div>
                        Navigate between questions freely
                      </li>
                    </ul>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#467EC7] rounded-full"></div>
                        Your progress is automatically saved
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#467EC7] rounded-full"></div>
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
                className="px-12 py-4 bg-[#467EC7] hover:bg-[#467EC7]/90 text-white font-semibold text-lg rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
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
