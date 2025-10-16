"use client";

import { Phone, MapPin, Globe } from "lucide-react";
import CityField from "../../profile/components/cityField";
import InputField from "../../profile/components/inputField";
import QuillField from "../../profile/components/quillField";
import { FileUploader } from "../../profile/components/fileUploader";

interface AdminFieldsSectionProps {
  setFieldValue: any;
}

export default function AdminFieldsSection({ setFieldValue }: AdminFieldsSectionProps) {
  return (
    <>
      <InputField
        name="phone"
        label="Company Phone"
        placeholder="Enter company phone"
        icon={Phone}
      />
      <InputField
        name="address"
        label="Full Address"
        placeholder="Company full address"
        icon={MapPin}
      />
      <CityField name="locationCity" label="City" placeholder="Search your city..." />
      <InputField
        name="website"
        label="Website"
        placeholder="https://example.com"
        icon={Globe}
      />
      <QuillField
        name="description"
        label="Description"
        placeholder="Write something about your company..."
      />
      <FileUploader name="logoUrl" label="Logo" />
    </>
  );
}
