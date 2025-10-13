"use client";

import { Upload } from "lucide-react";
import { ErrorMessage } from "formik";

interface CVUploadFieldProps {
  setFieldValue: (field: string, value: any) => void;
  errors: any;
  touched: any;
  values: {
    cvFile: File | null;
  };
}

export default function CVUploadField({
  setFieldValue,
  errors,
  touched,
  values,
}: CVUploadFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        Upload CV
      </label>
      <div className="w-full">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setFieldValue("cvFile", e.target.files[0]);
            }
          }}
          className="hidden"
          id="cvFile"
        />

        <label
          htmlFor="cvFile"
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all text-sm ${
            errors.cvFile && touched.cvFile
              ? "border-red-400 bg-red-50 text-red-400"
              : "border-input bg-secondary hover:bg-background text-muted-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span>
              {values.cvFile
                ? values.cvFile.name
                : "Choose PDF File. Max 10 MB"}
            </span>
          </div>
          {values.cvFile && (
            <span className="text-xs text-muted-foreground ml-2">
              {(values.cvFile.size / (1024 * 1024)).toFixed(2)} MB
            </span>
          )}
        </label>
      </div>
      <ErrorMessage
        name="cvFile"
        component="div"
        className="text-red-400 text-sm mt-1"
      />
    </div>
  );
}
