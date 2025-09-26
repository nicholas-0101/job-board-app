import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { CVFormData } from "./types";
import { createProjectHelpers } from "./formHelpers";

interface ProjectsSectionProps {
  formData: CVFormData;
  onInputChange: (field: keyof CVFormData, value: any) => void;
}

export default function ProjectsSection({ formData, onInputChange }: ProjectsSectionProps) {
  const { addProject, removeProject, updateProject } = 
    createProjectHelpers(formData, onInputChange);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Projects</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addProject}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>
      
      {formData.projects.map((project, index) => (
        <Card key={index} className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Project #{index + 1}</h4>
              {formData.projects.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProject(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <div>
              <Label>Project Name</Label>
              <Input
                value={project.name}
                onChange={(e) => updateProject(index, 'name', e.target.value)}
                placeholder="Event Management Application (TicketNest)"
              />
            </div>
            
            <div>
              <Label>Description</Label>
              <Textarea
                value={project.description}
                onChange={(e) => updateProject(index, 'description', e.target.value)}
                placeholder="Developed event management platform using Express.js Next.js 15, TypeScript..."
                rows={3}
              />
            </div>
            
            <div>
              <Label>Technologies (comma separated)</Label>
              <Input
                value={Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies || ''}
                onChange={(e) => {
                  // Store as string during typing
                  updateProject(index, 'technologies', e.target.value);
                }}
                onBlur={(e) => {
                  // Convert to array when user finishes editing
                  const techArray = e.target.value.split(',').map(t => t.trim()).filter(t => t.length > 0);
                  updateProject(index, 'technologies', techArray);
                }}
                placeholder="Express.js, Next.js 15, TypeScript, Tailwind CSS"
              />
            </div>
            
            <div>
              <Label>Project URL (optional)</Label>
              <Input
                value={project.url || ''}
                onChange={(e) => updateProject(index, 'url', e.target.value)}
                placeholder="https://github.com/yourusername/ticketnest"
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
