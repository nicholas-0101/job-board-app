import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { CVFormData } from "./types";
import PersonalInfoSection from "./PersonalInfoSection";
import WorkExperienceSection from "./WorkExperienceSection";
import ProjectsSection from "./ProjectsSection";
import OtherSections from "./OtherSections";

interface CVFormProps {
  formData: CVFormData;
  isGenerating: boolean;
  onInputChange: (field: keyof CVFormData, value: any) => void;
  onGenerateCV: () => void;
}

export default function CVForm({ formData, isGenerating, onInputChange, onGenerateCV }: CVFormProps) {

  return (
    <div className="max-w-4xl mx-auto">
      {/* CV Form */}
      <Card>
        <CardHeader>
          <CardTitle>CV Information</CardTitle>
          <CardDescription>
            Fill in your information to generate a professional CV
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">
                  ATS-Friendly Template
                </h3>
                <p className="text-sm text-blue-700">
                  Clean, professional template optimized for Applicant
                  Tracking Systems
                </p>
              </div>
            </div>
          </div>

          <PersonalInfoSection formData={formData} onInputChange={onInputChange} />
          <WorkExperienceSection formData={formData} onInputChange={onInputChange} />
          <ProjectsSection formData={formData} onInputChange={onInputChange} />
          <OtherSections formData={formData} onInputChange={onInputChange} />

          <Button
            onClick={onGenerateCV}
            disabled={isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating CV...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Generate CV
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
