import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Question, createAssessment } from "@/lib/skillAssessment";
import { saveToStorage, loadFromStorage, clearStorage } from "../utils/localStorage";

export function useCreateAssessment() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
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
      setCategory(storedData.category || "");
      setBadgeTemplateId(storedData.badgeTemplateId);
      setQuestions(storedData.questions || [{ question: "", options: ["", "", "", ""], answer: "" }]);
      
      if (storedData.savedQuestions && Array.isArray(storedData.savedQuestions)) {
        setSavedQuestions(new Set(storedData.savedQuestions));
      }
      
      toast.success("Draft restored from previous session");
    }
  }, []);

  const validateForm = () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return false;
    }

    if (!category.trim()) {
      toast.error("Category is required");
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

    const hasUnsavedQuestions = questions.some((_, index) => !savedQuestions.has(index));
    if (hasUnsavedQuestions) {
      toast.error("Please save all questions before creating the assessment");
      return;
    }

    setLoading(true);
    try {
      const assessmentData = {
        title,
        description: description || undefined,
        category,
        badgeTemplateId: badgeTemplateId || undefined,
        questions: questions.map((q) => ({
          question: q.question,
          options: q.options,
          answer: q.answer,
        })),
      };

      await createAssessment(assessmentData);
      clearStorage();
      toast.success("Assessment created successfully!");
      router.push("/developer/skill-assessment");
    } catch (error) {
      console.error("Error creating assessment:", error);
      toast.error("Failed to create assessment");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    title,
    setTitle,
    description,
    setDescription,
    category,
    setCategory,
    badgeTemplateId,
    setBadgeTemplateId,
    questions,
    setQuestions,
    savedQuestions,
    setSavedQuestions,
    handleSubmit,
    validateForm,
  };
}
