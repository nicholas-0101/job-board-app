import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { CVFormData } from "./types";
import { createLanguageHelpers } from "./formHelpers";

interface SkillsLanguagesSectionProps {
  formData: CVFormData;
  onInputChange: (field: keyof CVFormData, value: any) => void;
}

export default function SkillsLanguagesSection({ formData, onInputChange }: SkillsLanguagesSectionProps) {
  const { addLanguage, removeLanguage, updateLanguage } = 
    createLanguageHelpers(formData, onInputChange);

  return (
    <>
      {/* Skills */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Skills</h3>
        <div>
          <Label htmlFor="skills">Skills (comma separated)</Label>
          <Textarea
            id="skills"
            value={Array.isArray(formData.skills) ? formData.skills.join(', ') : formData.skills || ''}
            onChange={(e) => {
              // Always store as string during typing, convert to array only on blur or submit
              onInputChange("skills", e.target.value);
            }}
            onBlur={(e) => {
              // Convert to array when user finishes editing
              const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
              onInputChange("skills", skillsArray);
            }}
            placeholder="HTML5, CSS3, JavaScript, TypeScript, React.js, Next.js, Node.js, Express.js, MySQL, PostgreSQL"
            rows={3}
          />
        </div>
      </div>

      {/* Languages */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Languages</h3>
          <Button type="button" variant="outline" size="sm" onClick={addLanguage}>
            <Plus className="w-4 h-4 mr-2" />
            Add Language
          </Button>
        </div>
        
        {formData.languages.map((lang, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Language #{index + 1}</h4>
                {formData.languages.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeLanguage(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Language</Label>
                  <Input
                    value={lang.name}
                    onChange={(e) => updateLanguage(index, 'name', e.target.value)}
                    placeholder="Indonesian"
                  />
                </div>
                <div>
                  <Label>Level</Label>
                  <Input
                    value={lang.level}
                    onChange={(e) => updateLanguage(index, 'level', e.target.value)}
                    placeholder="Native"
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
