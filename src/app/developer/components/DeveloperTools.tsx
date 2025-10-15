"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, Award } from "lucide-react";
import { useRouter } from "next/navigation";

export function DeveloperTools() {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {/* Skill Assessment Management */}
      <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 group" style={{ borderColor: '#E1F1F3' }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#24CFA7' }}>
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#467EC7] transition-colors duration-300">
                  Skill Assessment
                </h3>
                <p className="text-gray-600 text-sm">
                  Manage skill tests, pass rate, badges, certificates
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className="text-white"
              style={{ backgroundColor: '#467EC7' }}
            >
              Manage
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Approval */}
      <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 group" style={{ borderColor: '#E1F1F3' }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#A3B6CE' }}>
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#467EC7] transition-colors duration-300">
                  Subscription Approval
                </h3>
                <p className="text-gray-600 text-sm">
                  Approve subscription payments & manage access
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className="text-white"
              style={{ backgroundColor: '#467EC7' }}
              onClick={() => router.push('/developer/subscription-approval/history')}
            >
              Review
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Badge & Certificate */}
      <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 group" style={{ borderColor: '#E1F1F3' }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#24CFA7' }}>
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#467EC7] transition-colors duration-300">
                  Badge & Certificate
                </h3>
                <p className="text-gray-600 text-sm">
                  Issued certificates, badge templates, verification system
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className="text-white"
              style={{ backgroundColor: '#467EC7' }}
            >
              Manage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
