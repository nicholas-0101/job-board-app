"use client";
import { FC, useState, ChangeEvent } from "react";
import { Upload } from "lucide-react";
import { useField } from "formik";
import { useUserStore } from "@/lib/store/userStore";

interface FileUploaderProps {
  name: string;
  label: string;
  isRounded?: boolean;
  maxFileSizeMB?: number;
  defaultImage?: string;
}

export const FileUploader: FC<FileUploaderProps> = ({
  name,
  label,
  isRounded = false,
  maxFileSizeMB = 1,
  defaultImage = "/fallback_pfp_image.jpg",
}) => {
  const { user } = useUserStore();
  const [field, , helpers] = useField(name);
  const { setValue } = helpers;
  const [preview, setPreview] = useState<string | null>(
    typeof field.value === "string" ? field.value : null
  );
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: string;
  } | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    setValue(file);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const sizeMB = file.size / 1024 / 1024;
    setFileInfo({
      name: file.name,
      size:
        sizeMB < 1
          ? (file.size / 1024).toFixed(1) + " KB"
          : sizeMB.toFixed(1) + " MB",
    });
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>
      <div className="mb-6 flex items-center gap-4">
        <div className="flex-shrink-0">
          <img
            src={preview || user?.profilePicture || defaultImage}
            alt="Preview"
            className={`w-16 h-16 object-cover border ${
              isRounded ? "rounded-full" : "rounded-lg"
            }`}
          />
        </div>

        <div className="flex-1">
          <label className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-input bg-secondary cursor-pointer hover:bg-background transition relative w-full justify-center">
            <Upload className="w-5 h-5 text-gray-400" /> Upload {label}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
            />
          </label>

          {fileInfo ? (
            <div className="mt-2 text-sm text-muted-foreground">
              <p>{fileInfo.name}</p>
              <p className="text-xs">{fileInfo.size}</p>
            </div>
          ) : (
            <div className="mt-2 text-sm text-muted-foreground">
              <p className="text-xs">
                Maximum file size {maxFileSizeMB}MB. Only .jpg, .jpeg, and .png
                are allowed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
