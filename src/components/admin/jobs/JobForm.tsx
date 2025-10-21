import { Button } from "@/components/ui/button";
import { Save, ArrowLeft } from "lucide-react";
import ErrorCard from "@/components/admin/shared/ErrorCard";
import BannerUpload from "./BannerUpload";

interface JobFormData {
  title: string;
  category: string;
  description: string;
  city: string;
  employmentType: string;
  experienceLevel: string;
  salaryMin: number | null;
  salaryMax: number | null;
  tags: string[];
  deadline: string | null;
  banner: string | null;
}

interface JobFormProps {
  form: JobFormData;
  submitting: boolean;
  error?: string | null;
  onUpdateForm: (field: keyof JobFormData, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function JobForm({ 
  form, 
  submitting, 
  error,
  onUpdateForm, 
  onSubmit, 
  onCancel 
}: JobFormProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Job Information</h2>
      
      {error && (
        <ErrorCard message={error} className="mb-4 rounded-lg shadow-sm" />
      )}
      
      <form onSubmit={onSubmit} className="grid gap-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
            <input 
              placeholder="e.g. Senior Frontend Developer" 
              value={form.title} 
              onChange={(e) => onUpdateForm('title', e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <input 
              placeholder="e.g. Engineering" 
              value={form.category} 
              onChange={(e) => onUpdateForm('category', e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              required 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea 
            placeholder="Describe the job responsibilities and requirements..." 
            value={form.description} 
            onChange={(e) => onUpdateForm('description', e.target.value)} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            rows={6} 
            required 
          />
        </div>

        <BannerUpload
          value={form.banner}
          onChange={(value) => onUpdateForm('banner', value)}
          disabled={submitting}
        />

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              placeholder="e.g. Jakarta"
              value={form.city}
              onChange={(e) => onUpdateForm("city", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
            <select
              value={form.employmentType || ""}
              onChange={(e) => onUpdateForm("employmentType", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
            <select
              value={form.experienceLevel || ""}
              onChange={(e) => onUpdateForm("experienceLevel", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Level</option>
              <option value="Entry Level">Entry Level</option>
              <option value="Junior">Junior</option>
              <option value="Mid-Level">Mid-Level</option>
              <option value="Senior">Senior</option>
              <option value="Lead/Manager">Lead/Manager</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Salary (IDR)</label>
            <input
              type="number"
              placeholder="e.g. 15000000"
              value={form.salaryMin ?? ""}
              onChange={(e) => onUpdateForm("salaryMin", Number(e.target.value) || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Salary (IDR)</label>
            <input
              type="number"
              placeholder="e.g. 25000000"
              value={form.salaryMax ?? ""}
              onChange={(e) => onUpdateForm("salaryMax", Number(e.target.value) || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
            <input
              type="date"
              value={form.deadline || ""}
              onChange={(e) => onUpdateForm("deadline", e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
          <input
            placeholder="e.g. React, TypeScript, Node.js"
            value={(form.tags || []).join(', ')}
            onChange={(e) => onUpdateForm("tags", e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={submitting} className="gap-2 bg-[#467EC7] hover:bg-[#578BCC]">
            <Save className="w-4 h-4" />
            {submitting ? "Creating..." : "Create Job"}
          </Button>
          <Button type="button" onClick={onCancel} variant="outline" className="gap-2 text-gray-600 border-gray-300 hover:bg-gray-50">
            <ArrowLeft className="w-4 h-4" />
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
