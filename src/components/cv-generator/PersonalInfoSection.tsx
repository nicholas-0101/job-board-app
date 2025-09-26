import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CVFormData } from "./types";

interface PersonalInfoSectionProps {
  formData: CVFormData;
  onInputChange: (field: keyof CVFormData, value: any) => void;
}

export default function PersonalInfoSection({ formData, onInputChange }: PersonalInfoSectionProps) {
  return (
    <>
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => onInputChange("fullName", e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onInputChange("email", e.target.value)}
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => onInputChange("phone", e.target.value)}
              placeholder="08123456789"
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => onInputChange("address", e.target.value)}
              placeholder="City, Country"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="linkedin">LinkedIn Profile</Label>
            <Input
              id="linkedin"
              value={formData.linkedin || ''}
              onChange={(e) => onInputChange("linkedin", e.target.value)}
              placeholder="www.linkedin.com/in/yourusername"
            />
          </div>
          <div>
            <Label htmlFor="portfolio">Portfolio Website</Label>
            <Input
              id="portfolio"
              value={formData.portfolio || ''}
              onChange={(e) => onInputChange("portfolio", e.target.value)}
              placeholder="https://yourportfolio.com"
            />
          </div>
        </div>
      </div>

      {/* Professional Objective */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Professional Objective</h3>
        <div>
          <Label htmlFor="objective">Objective</Label>
          <Textarea
            id="objective"
            value={formData.objective}
            onChange={(e) => onInputChange("objective", e.target.value)}
            placeholder="Brief summary of your professional background and career objectives..."
            rows={4}
          />
        </div>
      </div>
    </>
  );
}
