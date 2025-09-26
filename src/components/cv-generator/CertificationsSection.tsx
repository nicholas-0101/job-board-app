import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { CVFormData } from "./types";
import { createCertificationHelpers } from "./formHelpers";

interface CertificationsSectionProps {
  formData: CVFormData;
  onInputChange: (field: keyof CVFormData, value: any) => void;
}

export default function CertificationsSection({ formData, onInputChange }: CertificationsSectionProps) {
  const { addCertification, removeCertification, updateCertification } = 
    createCertificationHelpers(formData, onInputChange);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Certifications</h3>
        <Button type="button" variant="outline" size="sm" onClick={addCertification}>
          <Plus className="w-4 h-4 mr-2" />
          Add Certification
        </Button>
      </div>
      
      {formData.certifications.map((cert, index) => (
        <Card key={index} className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Certification #{index + 1}</h4>
              {formData.certifications.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => removeCertification(index)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Certification Name</Label>
                <Input
                  value={cert.name}
                  onChange={(e) => updateCertification(index, 'name', e.target.value)}
                  placeholder="Fullstack Web Development Certificate"
                />
              </div>
              <div>
                <Label>Issuer</Label>
                <Input
                  value={cert.issuer}
                  onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                  placeholder="Purwadhika Digital Technology School"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Date</Label>
                <Input
                  value={cert.date}
                  onChange={(e) => updateCertification(index, 'date', e.target.value)}
                  placeholder="Dec 2024"
                />
              </div>
              <div>
                <Label>Link (optional)</Label>
                <Input
                  value={cert.link || ''}
                  onChange={(e) => updateCertification(index, 'link', e.target.value)}
                  placeholder="https://certificate.purwadhika.com/fullstack-2024"
                />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
