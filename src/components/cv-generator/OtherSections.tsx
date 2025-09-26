import { CVFormData } from "./types";
import EducationSection from "./EducationSection";
import CertificationsSection from "./CertificationsSection";
import SkillsLanguagesSection from "./SkillsLanguagesSection";

interface OtherSectionsProps {
  formData: CVFormData;
  onInputChange: (field: keyof CVFormData, value: any) => void;
}

export default function OtherSections({ formData, onInputChange }: OtherSectionsProps) {

  return (
    <>
      <EducationSection formData={formData} onInputChange={onInputChange} />
      <CertificationsSection formData={formData} onInputChange={onInputChange} />
      <SkillsLanguagesSection formData={formData} onInputChange={onInputChange} />
    </>
  );
}
