"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DeveloperAuthGuard from "@/components/auth/DeveloperAuthGuard";
import DeveloperLayout from "../../components/DeveloperLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Award, Loader2, Upload, X } from "lucide-react";
import { createBadgeTemplate } from "@/lib/skillAssessment";
import toast from "react-hot-toast";

export default function CreateBadgePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    category: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 1MB to match backend)
    if (file.size > 1024 * 1024) {
      toast.error("Image size must be less than 1MB");
      return;
    }

    setIconFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setIconPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveIcon = () => {
    setIconFile(null);
    setIconPreview("");
    setFormData(prev => ({ ...prev, icon: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Badge name is required");
      return;
    }

    if (formData.name.length < 3) {
      toast.error("Badge name must be at least 3 characters");
      return;
    }

    // Validation for icon
    if (!iconFile) {
      toast.error("Please upload a badge icon");
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description || undefined,
      iconFile: iconFile,
      category: formData.category || undefined,
    };

    console.log("Creating badge with file:", iconFile.name);

    setLoading(true);
    try {
      const response = await createBadgeTemplate(payload);
      console.log("Badge created:", response);

      toast.success("Badge template created successfully!");
      router.push("/developer/badges");
    } catch (error: any) {
      console.error("Error creating badge:", error);
      console.error("Error response full:", error.response);
      console.error("Error response data:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error message:", error.message);
      
      const errorMsg = error.response?.data?.message || 
                       error.response?.data?.errors?.[0] || 
                       error.message ||
                       "Failed to create badge template";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <DeveloperAuthGuard>
      <DeveloperLayout>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 rounded-lg">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="hover:bg-gray-100"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                      <Award className="w-6 h-6 mr-2 text-[#467EC7]" />
                      Create Badge Template
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                      Create a new achievement badge for assessments
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Badge Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Badge Name */}
                <div>
                  <Label htmlFor="name">
                    Badge Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Full Stack Developer"
                    required
                    disabled={loading}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    A clear and descriptive name for the badge
                  </p>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe what this badge represents..."
                    rows={4}
                    disabled={loading}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Explain the achievement or skill this badge represents
                  </p>
                </div>

                {/* Icon Upload */}
                <div>
                  <Label htmlFor="icon">Badge Icon</Label>
                  <div className="mt-2">
                    {!iconPreview ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#467EC7] transition-colors">
                        <input
                          type="file"
                          id="icon"
                          accept="image/*"
                          onChange={handleFileChange}
                          disabled={loading || uploading}
                          className="hidden"
                        />
                        <label 
                          htmlFor="icon" 
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <Upload className="w-12 h-12 text-gray-400 mb-2" />
                          <p className="text-sm font-medium text-gray-700">
                            {uploading ? "Uploading..." : "Click to upload badge icon"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG up to 2MB
                          </p>
                        </label>
                      </div>
                    ) : (
                      <div className="relative border-2 border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-full bg-[#467EC7]/20 flex items-center justify-center overflow-hidden">
                            <img 
                              src={iconPreview} 
                              alt="Badge icon preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {iconFile?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {iconFile && (iconFile.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveIcon}
                            disabled={loading || uploading}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Upload an image for the badge icon
                  </p>
                </div>

                {/* Category */}
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g., fullstack, frontend, backend"
                    disabled={loading}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Categorize this badge for easier organization
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#467EC7] hover:bg-[#467EC7]/90"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Award className="w-4 h-4 mr-2" />
                        Create Badge
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </DeveloperLayout>
    </DeveloperAuthGuard>
  );
}
