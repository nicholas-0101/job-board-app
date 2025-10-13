"use client";

import QuillField from "./components/quillField";
import { FileUploader } from "./components/fileUploader";

export default function AboutCompanySection() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground border-b pb-2">
        About Company
      </h3>

      <QuillField
        name="description"
        label="Company Description"
        placeholder="Write something about your company..."
      />

      <FileUploader name="logoUrl" label="Company Logo" />
    </div>
  );
}
