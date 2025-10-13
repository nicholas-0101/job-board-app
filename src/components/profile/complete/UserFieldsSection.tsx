"use client";

import { Phone, Calendar, GraduationCap, Home } from "lucide-react";
import CityField from "../../profile/components/cityField";
import InputField from "../../profile/components/inputField";
import SelectField from "../../profile/components/selectField";
import { FileUploader } from "../../profile/components/fileUploader";

interface UserFieldsSectionProps {
  setFieldValue: any;
}

export default function UserFieldsSection({ setFieldValue }: UserFieldsSectionProps) {
  return (
    <>
      <InputField
        name="phone"
        label="Phone"
        placeholder="Enter your phone"
        icon={Phone}
      />
      <SelectField
        name="gender"
        label="Gender"
        options={[
          { value: "Male", label: "Male" },
          { value: "Female", label: "Female" },
        ]}
      />
      <InputField
        name="dob"
        label="Date of Birth"
        type="date"
        icon={Calendar}
      />
      <InputField
        name="education"
        label="Education"
        placeholder="Your education"
        icon={GraduationCap}
      />
      <InputField
        name="address"
        label="Full Address"
        placeholder="Your full address"
        icon={Home}
      />
      <CityField name="city" label="City" placeholder="Search your city..." />
      <FileUploader name="profilePicture" label="Profile Picture" isRounded />
    </>
  );
}
