"use client";
import { useState, useEffect } from "react";
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

// LocalStorage keys
const STORAGE_KEY = "create-assessment-draft";

// Helper functions for localStorage
const saveToStorage = (data: any) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
};

const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
    return null;
  }
};

const clearStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear localStorage:", error);
  }
};

export default function CreateAssessmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [savingQuestion, setSavingQuestion] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [badgeTemplateId, setBadgeTemplateId] = useState<number | undefined>();
  const [questions, setQuestions] = useState<Question[]>([
    { question: "", options: ["", "", "", ""], answer: "" },
  ]);
  const [savedQuestions, setSavedQuestions] = useState<Set<number>>(new Set());

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedData = loadFromStorage();
    if (storedData) {
      setTitle(storedData.title || "");
      setDescription(storedData.description || "");
      setBadgeTemplateId(storedData.badgeTemplateId);
      setQuestions(storedData.questions || [{ question: "", options: ["", "", "", ""], answer: "" }]);
      
      // Restore saved questions set
      if (storedData.savedQuestions && Array.isArray(storedData.savedQuestions)) {
        setSavedQuestions(new Set(storedData.savedQuestions));
      }
      
      console.log("Loaded draft from localStorage:", storedData);
      toast.success("Draft restored from previous session");
    }
  }, []);

  // Auto-save to localStorage whenever form data changes
  useEffect(() => {
    const dataToSave = {
      title,
      description,
      badgeTemplateId,
      questions,
      savedQuestions: Array.from(savedQuestions),
      lastSaved: new Date().toISOString(),
    };
    
    // Only save if there's meaningful data (not just empty initial state)
    if (title.trim() || description.trim() || questions.some(q => q.question.trim())) {
      saveToStorage(dataToSave);
    }
  }, [title, description, badgeTemplateId, questions, savedQuestions]);

  // Warn user before leaving page with unsaved changes
  useEffect(() => {
    const hasUnsavedData = title.trim() || description.trim() || questions.some(q => q.question.trim());
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedData) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
        return "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    if (hasUnsavedData) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [title, description, questions]);

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
    
    // Remove question and update saved questions set
    setQuestions(questions.filter((_, i) => i !== index));
    
    // Update saved questions set - remove the deleted index and shift down higher indices
    const newSavedQuestions = new Set<number>();
    savedQuestions.forEach(savedIndex => {
      if (savedIndex < index) {
        // Keep indices below the deleted one
        newSavedQuestions.add(savedIndex);
      } else if (savedIndex > index) {
        // Shift down indices above the deleted one
        newSavedQuestions.add(savedIndex - 1);
      }
      // Skip the deleted index (savedIndex === index)
    });
    setSavedQuestions(newSavedQuestions);
  };

  const handleQuestionChange = (index: number, updatedQuestion: Question) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
    
    // Remove from saved questions if modified
    if (savedQuestions.has(index)) {
      const newSavedQuestions = new Set(savedQuestions);
      newSavedQuestions.delete(index);
      setSavedQuestions(newSavedQuestions);
    }
  };

  const validateQuestion = (question: Question, index: number) => {
    if (!question.question.trim()) {
      toast.error(`Question ${index + 1}: Question text is required`);
      return false;
    }
    if (question.options.some((opt) => !opt.trim())) {
      toast.error(`Question ${index + 1}: All options must be filled`);
      return false;
    }
    if (!question.answer.trim()) {
      toast.error(`Question ${index + 1}: Correct answer is required`);
      return false;
    }
    if (!question.options.includes(question.answer)) {
      toast.error(`Question ${index + 1}: Answer must match one of the options`);
      return false;
    }
    return true;
  };

  const handleSaveQuestion = async (index: number) => {
    const question = questions[index];
    
    if (!validateQuestion(question, index)) return;

    // Save question to localStorage only
    setSavingQuestion(index);
    try {
      // Mark question as saved
      const newSavedQuestions = new Set(savedQuestions);
      newSavedQuestions.add(index);
      setSavedQuestions(newSavedQuestions);
      
      toast.success(`Question ${index + 1} saved to draft!`);
    } catch (error: any) {
      console.error("Error saving question:", error);
      toast.error("Failed to save question");
    } finally {
      setSavingQuestion(null);
    }
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

    // Validate that all questions are saved
    const hasUnsavedQuestions = questions.some((_, index) => !savedQuestions.has(index));
    if (hasUnsavedQuestions) {
      toast.error("Please save all questions before completing the assessment");
      return;
    }

    // Create assessment with all questions
    const payload: any = {
      title,
      questions,
    };
    
    if (description && description.trim()) {
      payload.description = description;
    }
    
    if (badgeTemplateId) {
      payload.badgeTemplateId = badgeTemplateId;
    }
    
    console.log("Creating complete assessment:", payload);
    console.log("Questions count:", questions.length);

    setLoading(true);
    try {
      await createAssessment(payload);

      clearStorage(); // Clear draft when successfully created
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
                Create a skill assessment test with multiple choice questions. Save each question as you create them.
              </p>
              {savedQuestions.size > 0 && (
                <div className="mt-3 px-4 py-2 bg-green-100 border border-green-300 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✅ Questions saved to draft: {savedQuestions.size} of {questions.length}
                  </p>
                </div>
              )}
              
              {/* Draft info */}
              {(title.trim() || description.trim() || questions.some(q => q.question.trim())) && (
                <div className="mt-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                  <p className="text-sm text-blue-800">
                    💾 Draft auto-saved (refreshing page will restore your work)
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      clearStorage();
                      window.location.reload();
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Clear Draft
                  </Button>
                </div>
              )}
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
                <CardTitle>Questions ({questions.length}/25)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {questions.map((question, index) => (
                  <QuestionForm
                    key={index}
                    index={index}
                    question={question}
                    onChange={handleQuestionChange}
                    onRemove={handleRemoveQuestion}
                    onSave={handleSaveQuestion}
                    onAddQuestion={handleAddQuestion}
                    canRemove={questions.length > 1}
                    isSaved={savedQuestions.has(index)}
                    isSaving={savingQuestion === index}
                    isLastQuestion={index === questions.length - 1}
                    canAddMore={questions.length < 25}
                  />
                ))}
                
                {/* Show add question button if no questions */}
                {questions.length === 0 && (
                  <div className="flex justify-center py-8">
                    <Button
                      type="button"
                      onClick={handleAddQuestion}
                      className="bg-gray-800 hover:bg-gray-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Question
                    </Button>
                  </div>
                )}
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
                {loading ? "Creating Assessment..." : "Create Assessment"}
              </Button>
            </div>
          </form>
        </div>
      </DeveloperLayout>
    </DeveloperAuthGuard>
  );
}
