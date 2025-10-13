"use client";

import { Phone, Building, Globe } from "lucide-react";
import InputField from "../../profile/components/inputField";
import CityField from "../../profile/components/cityField";
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
        name="location"
        label="Full Address"
        placeholder="Company full address"
        icon={Building}
      />
      <CityField
        name="city"
        label="City"
        placeholder="Search your city..."
      />
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
      <FileUploader name="logo" label="Logo" />
    </>
  );
}
