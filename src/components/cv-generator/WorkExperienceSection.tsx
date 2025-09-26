import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { CVFormData } from "./types";
import { createWorkExperienceHelpers } from "./formHelpers";

interface WorkExperienceSectionProps {
  formData: CVFormData;
  onInputChange: (field: keyof CVFormData, value: any) => void;
}

export default function WorkExperienceSection({ formData, onInputChange }: WorkExperienceSectionProps) {
  const { addWorkExperience, removeWorkExperience, updateWorkExperience } = 
    createWorkExperienceHelpers(formData, onInputChange);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Work Experience</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addWorkExperience}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>
      
      {formData.workExperience.map((exp, index) => (
        <Card key={index} className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Experience #{index + 1}</h4>
              {formData.workExperience.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeWorkExperience(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Company</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                  placeholder="Tech Startup Indonesia"
                />
              </div>
              <div>
                <Label>Position</Label>
                <Input
                  value={exp.position}
                  onChange={(e) => updateWorkExperience(index, 'position', e.target.value)}
                  placeholder="Fullstack Developer"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Start Date</Label>
                <Input
                  value={exp.startDate}
                  onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                  placeholder="Jan 2023"
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  value={exp.endDate}
                  onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)}
                  placeholder="Present"
                />
              </div>
            </div>
            
            <div>
              <Label>Responsibilities (one per line)</Label>
              <Textarea
                value={exp.responsibilities.join('\n')}
                onChange={(e) => updateWorkExperience(index, 'responsibilities', e.target.value.split('\n'))}
                placeholder="• Developed and maintained web applications using React.js and Node.js for 50+ clients.&#10;• Collaborated with cross-functional teams to deliver projects 20% faster than deadline."
                rows={4}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
