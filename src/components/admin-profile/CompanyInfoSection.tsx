"use client";

import InputField from "./components/inputField";
import { Phone, Globe } from "lucide-react";

export default function CompanyInfoSection() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground border-b pb-2">
        Company Information
      </h3>

      <InputField
        name="phone"
        label="Company Phone"
        placeholder="+628123456789"
        icon={Phone}
      />

      <InputField
        name="website"
        label="Website"
        placeholder="https://example.com"
        icon={Globe}
      />
    </div>
  );
}
