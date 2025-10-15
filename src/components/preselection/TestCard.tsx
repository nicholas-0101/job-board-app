"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { TestTube, Target, BarChart3, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TestSummary {
  jobId: number;
  jobTitle: string;
  isActive: boolean;
  totalQuestions: number;
  passingScore: number | null;
}

interface TestCardProps {
  test: TestSummary;
  index: number;
}

export function TestCard({ test, index }: TestCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: index * 0.05 }}
    >
      <Card 
        className="hover:shadow-lg transition-all duration-300 shadow-md border-l-4" 
        style={{ borderLeftColor: test.isActive ? '#24CFA7' : '#94a3b8' }}
      >
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h4 className="text-lg font-semibold">{test.jobTitle}</h4>
                {test.isActive ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-700 font-medium">
                    ✓ Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700 font-medium">
                    Inactive
                  </span>
                )}
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TestTube className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Questions</p>
                    <p className="font-semibold">{test.totalQuestions} / 25</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Target className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Passing Score</p>
                    <p className="font-semibold">{test.passingScore ?? '-'} / 25</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BarChart3 className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Status</p>
                    <p className="font-semibold">{test.isActive && test.totalQuestions >= 25 ? 'Ready' : 'Setup Required'}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/jobs/${test.jobId}/edit?tab=test`}>
                <Button className="bg-[#24CFA7] hover:bg-[#1fc39c] shadow-md">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Test
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
