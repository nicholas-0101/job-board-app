import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import { CVFormData } from "./types";

interface CVFormProps {
  formData: CVFormData;
  isGenerating: boolean;
  onInputChange: (field: keyof CVFormData, value: string) => void;
  onGenerateCV: () => void;
}

export default function CVForm({ formData, isGenerating, onInputChange, onGenerateCV }: CVFormProps) {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* CV Form */}
      <Card>
        <CardHeader>
          <CardTitle>CV Information</CardTitle>
          <CardDescription>
            Fill in your information to generate a professional CV
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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

          {/* Personal Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  onInputChange("fullName", e.target.value)
                }
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  onInputChange("email", e.target.value)
                }
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  onInputChange("phone", e.target.value)
                }
                placeholder="08123456789"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  onInputChange("address", e.target.value)
                }
                placeholder="City, Country"
              />
            </div>
          </div>

          {/* Professional Summary */}
          <div>
            <Label htmlFor="summary">Professional Summary</Label>
            <Textarea
              id="summary"
              value={formData.summary}
              onChange={(e) =>
                onInputChange("summary", e.target.value)
              }
              placeholder="Brief summary of your professional background and career objectives..."
              rows={3}
            />
          </div>

          {/* Work Experience */}
          <div>
            <Label htmlFor="experience">Work Experience</Label>
            <Textarea
              id="experience"
              value={formData.experience}
              onChange={(e) =>
                onInputChange("experience", e.target.value)
              }
              placeholder="List your work experience, including job titles, companies, dates, and key achievements..."
              rows={4}
            />
          </div>

          {/* Education */}
          <div>
            <Label htmlFor="education">Education</Label>
            <Textarea
              id="education"
              value={formData.education}
              onChange={(e) =>
                onInputChange("education", e.target.value)
              }
              placeholder="List your educational background, including degrees, institutions, and dates..."
              rows={3}
            />
          </div>

          {/* Skills */}
          <div>
            <Label htmlFor="skills">Skills</Label>
            <Textarea
              id="skills"
              value={formData.skills}
              onChange={(e) =>
                onInputChange("skills", e.target.value)
              }
              placeholder="List your technical and soft skills, separated by commas..."
              rows={2}
            />
          </div>

          {/* Languages */}
          <div>
            <Label htmlFor="languages">Languages</Label>
            <Input
              id="languages"
              value={formData.languages}
              onChange={(e) =>
                onInputChange("languages", e.target.value)
              }
              placeholder="English (Native), Spanish (Fluent), French (Intermediate)"
            />
          </div>

          {/* Certifications */}
          <div>
            <Label htmlFor="certifications">Certifications</Label>
            <Textarea
              id="certifications"
              value={formData.certifications}
              onChange={(e) =>
                onInputChange("certifications", e.target.value)
              }
              placeholder="List your professional certifications and licenses..."
              rows={2}
            />
          </div>

          {/* LinkedIn Profile */}
          <div>
            <Label htmlFor="linkedin">LinkedIn Profile (Optional)</Label>
            <Input
              id="linkedin"
              value={formData.linkedin}
              onChange={(e) =>
                onInputChange("linkedin", e.target.value)
              }
              placeholder="https://linkedin.com/in/your-profile"
            />
          </div>

          {/* Portfolio */}
          <div>
            <Label htmlFor="portfolio">
              Portfolio Website (Optional)
            </Label>
            <Input
              id="portfolio"
              value={formData.portfolio}
              onChange={(e) =>
                onInputChange("portfolio", e.target.value)
              }
              placeholder="https://your-portfolio.com"
            />
          </div>

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

      {/* CV Preview Info */}
      <Card>
        <CardHeader>
          <CardTitle>CV Preview</CardTitle>
          <CardDescription>
            Your CV will be generated using our ATS-optimized template
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              ATS-Friendly Design
            </h3>
            <p className="text-gray-600 mb-4">
              Clean, professional layout optimized for Applicant Tracking
              Systems
            </p>
            <div className="text-sm text-gray-500">
              <p>✓ ATS-compatible formatting</p>
              <p>✓ Professional typography</p>
              <p>✓ Clean section organization</p>
              <p>✓ Optimized for readability</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
