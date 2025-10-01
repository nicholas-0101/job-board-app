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
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { createAssessment, Question } from "@/lib/skillAssessment";
import toast from "react-hot-toast";
import QuestionForm from "./components/QuestionForm";
import BadgeSelector from "./components/BadgeSelector";

export default function CreateAssessmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [badgeTemplateId, setBadgeTemplateId] = useState<number | undefined>();
  const [questions, setQuestions] = useState<Question[]>([
    { question: "", options: ["", "", "", ""], answer: "" },
  ]);

  const handleAddQuestion = () => {
    if (questions.length >= 25) {
      toast.error("Maximum 25 questions allowed");
      return;
    }
    setQuestions([...questions, { question: "", options: ["", "", "", ""], answer: "" }]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) {
      toast.error("At least one question is required");
      return;
    }
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, updatedQuestion: Question) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return false;
    }

    if (questions.length < 1) {
      toast.error("At least 1 question is required");
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        toast.error(`Question ${i + 1}: Question text is required`);
        return false;
      }
      if (q.options.some((opt) => !opt.trim())) {
        toast.error(`Question ${i + 1}: All options must be filled`);
        return false;
      }
      if (!q.answer.trim()) {
        toast.error(`Question ${i + 1}: Correct answer is required`);
        return false;
      }
      if (!q.options.includes(q.answer)) {
        toast.error(`Question ${i + 1}: Answer must match one of the options`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      title,
      description: description || undefined,
      badgeTemplateId,
      questions,
    };
    
    console.log("Submitting assessment:", payload);
    console.log("Questions count:", questions.length);

    setLoading(true);
    try {
      await createAssessment(payload);

      toast.success("Assessment created successfully!");
      router.push("/developer/skill-assessment");
    } catch (error: any) {
      console.error("Error creating assessment:", error);
      console.error("Error response:", error.response);
      console.error("Error response data:", error.response?.data);
      console.error("Error status:", error.response?.status);
      const errorMsg = error.response?.data?.message || error.response?.data?.errors?.[0] || "Failed to create assessment";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DeveloperAuthGuard>
      <DeveloperLayout>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 rounded-lg">
            <div className="px-6 py-8">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-3xl font-bold text-[#467EC7]">
                Create New Assessment
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Create a skill assessment test with 25 multiple choice questions
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Assessment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., JavaScript Fundamentals"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the assessment"
                    rows={3}
                  />
                </div>
                <BadgeSelector
                  selectedBadgeId={badgeTemplateId}
                  onSelect={setBadgeTemplateId}
                />
              </CardContent>
            </Card>

            {/* Questions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Questions ({questions.length}/25)</CardTitle>
                  <Button
                    type="button"
                    onClick={handleAddQuestion}
                    disabled={questions.length >= 25}
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Question
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {questions.map((question, index) => (
                  <QuestionForm
                    key={index}
                    index={index}
                    question={question}
                    onChange={handleQuestionChange}
                    onRemove={handleRemoveQuestion}
                    canRemove={questions.length > 1}
                  />
                ))}
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-3">
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
                {loading ? "Creating..." : "Create Assessment"}
              </Button>
            </div>
          </form>
        </div>
      </DeveloperLayout>
    </DeveloperAuthGuard>
  );
}
