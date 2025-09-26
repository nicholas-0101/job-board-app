import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { CVFormData } from "./types";
import { createEducationHelpers } from "./formHelpers";

interface EducationSectionProps {
  formData: CVFormData;
  onInputChange: (field: keyof CVFormData, value: any) => void;
}

export default function EducationSection({ formData, onInputChange }: EducationSectionProps) {
  const { addEducation, removeEducation, updateEducation } = 
    createEducationHelpers(formData, onInputChange);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Education</h3>
        <Button type="button" variant="outline" size="sm" onClick={addEducation}>
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>
      
      {formData.educationDetails.map((edu, index) => (
        <Card key={index} className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Education #{index + 1}</h4>
              {formData.educationDetails.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => removeEducation(index)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Institution</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                  placeholder="Purwadhika Digital Technology School"
                />
              </div>
              <div>
                <Label>Degree</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  placeholder="Fullstack Web Development Bootcamp"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Year</Label>
                <Input
                  value={edu.year}
                  onChange={(e) => updateEducation(index, 'year', e.target.value)}
                  placeholder="2024"
                />
              </div>
              <div>
                <Label>GPA (optional)</Label>
                <Input
                  value={edu.gpa || ''}
                  onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                  placeholder="3.85"
                />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
