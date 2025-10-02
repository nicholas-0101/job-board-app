"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DeveloperAuthGuard from "@/components/auth/DeveloperAuthGuard";
import DeveloperLayout from "../../../components/DeveloperLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { getAssessmentById, updateAssessment, Question } from "@/lib/skillAssessment";
import toast from "react-hot-toast";
import QuestionForm from "../../create/components/QuestionForm";
import BadgeSelector from "../../create/components/BadgeSelector";

// LocalStorage keys
const STORAGE_KEY_PREFIX = "edit-assessment-draft-";

// Helper functions for localStorage
const saveToStorage = (assessmentId: string, data: any) => {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + assessmentId, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
};

const loadFromStorage = (assessmentId: string) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PREFIX + assessmentId);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
    return null;
  }
};

const clearStorage = (assessmentId: string) => {
  try {
    localStorage.removeItem(STORAGE_KEY_PREFIX + assessmentId);
  } catch (error) {
    console.error("Failed to clear localStorage:", error);
  }
};

export default function EditAssessmentPage() {
  const router = useRouter();
  const params = useParams();
  const assessmentId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [savingQuestion, setSavingQuestion] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [badgeTemplateId, setBadgeTemplateId] = useState<number | undefined>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [savedQuestions, setSavedQuestions] = useState<Set<number>>(new Set());
  const [originalData, setOriginalData] = useState<any>(null);

  useEffect(() => {
    fetchAssessment();
  }, [assessmentId]);

  const fetchAssessment = async () => {
    setFetching(true);
    try {
      const response = await getAssessmentById(parseInt(assessmentId));
      console.log("Assessment response:", response);
      const data = response.data?.data || response.data;
      console.log("Assessment data:", data);
      
      if (data) {
        setTitle(data.title || "");
        setDescription(data.description || "");
        console.log("Badge Template ID from backend:", data.badgeTemplateId);
        setBadgeTemplateId(data.badgeTemplateId || undefined);
        
        // Map questions from backend format
        console.log("Questions from backend:", data.questions);
        const mappedQuestions = data.questions?.map((q: any) => ({
          question: q.question,
          options: Array.isArray(q.options) ? q.options : [],
          answer: q.answer,
        })) || [];
        
        console.log("Mapped questions:", mappedQuestions);
        
        if (mappedQuestions.length > 0) {
          setQuestions(mappedQuestions);
        } else {
          // No questions loaded - show warning
          toast.error("Questions could not be loaded. Please restart backend server.", {
            duration: 5000,
          });
          setQuestions([{ question: "", options: ["", "", "", ""], answer: "" }]);
        }
        
        // Store original data for comparison
        setOriginalData({
          title: data.title || "",
          description: data.description || "",
          badgeTemplateId: data.badgeTemplateId || undefined,
          questions: mappedQuestions,
        });
        
        // Mark all original questions as saved
        const originalSavedQuestions = new Set<number>();
        mappedQuestions.forEach((_: any, index: number) => {
          originalSavedQuestions.add(index);
        });
        setSavedQuestions(originalSavedQuestions);
        
        // Check for draft data in localStorage
        const storedData = loadFromStorage(assessmentId);
        if (storedData) {
          setTitle(storedData.title || data.title || "");
          setDescription(storedData.description || data.description || "");
          setBadgeTemplateId(storedData.badgeTemplateId || data.badgeTemplateId || undefined);
          setQuestions(storedData.questions || mappedQuestions);
          
          // Restore saved questions set (prioritize stored data)
          if (storedData.savedQuestions && Array.isArray(storedData.savedQuestions)) {
            setSavedQuestions(new Set(storedData.savedQuestions));
          }
          
          console.log("Loaded draft from localStorage:", storedData);
          toast.success("Draft changes restored from previous session");
        }
      }
    } catch (error: any) {
      console.error("Error fetching assessment:", error);
      toast.error("Failed to load assessment");
    } finally {
      setFetching(false);
    }
  };

  // Auto-save to localStorage whenever form data changes
  useEffect(() => {
    if (!originalData || fetching) return; // Don't save during initial load
    
    const dataToSave = {
      title,
      description,
      badgeTemplateId,
      questions,
      savedQuestions: Array.from(savedQuestions),
      lastSaved: new Date().toISOString(),
    };
    
    // Only save if there are changes from original data
    const hasChanges = 
      title !== originalData.title ||
      description !== originalData.description ||
      badgeTemplateId !== originalData.badgeTemplateId ||
      JSON.stringify(questions) !== JSON.stringify(originalData.questions);
    
    if (hasChanges) {
      saveToStorage(assessmentId, dataToSave);
    }
  }, [title, description, badgeTemplateId, questions, savedQuestions, originalData, fetching, assessmentId]);

  // Warn user before leaving page with unsaved changes
  useEffect(() => {
    if (!originalData) return;
    
    const hasUnsavedData = 
      title !== originalData.title ||
      description !== originalData.description ||
      badgeTemplateId !== originalData.badgeTemplateId ||
      JSON.stringify(questions) !== JSON.stringify(originalData.questions);
    
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
  }, [title, description, badgeTemplateId, questions, originalData]);

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
      toast.error("Please save all questions before updating the assessment");
      return;
    }

    setLoading(true);
    try {
      await updateAssessment(parseInt(assessmentId), {
        title,
        description: description || undefined,
        badgeTemplateId,
        questions,
      });

      clearStorage(assessmentId); // Clear draft when successfully updated
      toast.success("Assessment updated successfully!");
      router.push("/developer/skill-assessment");
    } catch (error: any) {
      console.error("Error updating assessment:", error);
      toast.error(error.response?.data?.message || "Failed to update assessment");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <DeveloperAuthGuard>
        <DeveloperLayout>
          <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-[#467EC7]" />
          </div>
        </DeveloperLayout>
      </DeveloperAuthGuard>
    );
  }

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
                Edit Assessment
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Update your skill assessment test. Save each question as you modify them.
              </p>
              {savedQuestions.size > 0 && (
                <div className="mt-3 px-4 py-2 bg-green-100 border border-green-300 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✅ Questions saved to draft: {savedQuestions.size} of {questions.length}
                  </p>
                </div>
              )}
              
              {/* Draft info */}
              {originalData && (
                title !== originalData.title ||
                description !== originalData.description ||
                badgeTemplateId !== originalData.badgeTemplateId ||
                JSON.stringify(questions) !== JSON.stringify(originalData.questions)
              ) && (
                <div className="mt-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                  <p className="text-sm text-blue-800">
                    💾 Changes auto-saved (refreshing page will restore your work)
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      clearStorage(assessmentId);
                      window.location.reload();
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Discard Changes
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
                {loading ? "Updating..." : "Update Assessment"}
              </Button>
            </div>
          </form>
        </div>
      </DeveloperLayout>
    </DeveloperAuthGuard>
  );
}
