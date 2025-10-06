import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Question, getAssessmentById, updateAssessment } from "@/lib/skillAssessment";
import { saveToStorage, loadFromStorage, clearStorage } from "../utils/localStorage";

export function useEditAssessment(assessmentId: string) {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [savingQuestion, setSavingQuestion] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [badgeTemplateId, setBadgeTemplateId] = useState<number | undefined>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [savedQuestions, setSavedQuestions] = useState<Set<number>>(new Set());
  const [originalData, setOriginalData] = useState<any>(null);

  const fetchAssessment = async () => {
    setFetching(true);
    try {
      const response = await getAssessmentById(parseInt(assessmentId));
      const data = response.data?.data || response.data;
      
      if (data) {
        setTitle(data.title || "");
        setDescription(data.description || "");
        setBadgeTemplateId(data.badgeTemplateId || undefined);
        
        const mappedQuestions = data.questions?.map((q: any) => ({
          question: q.question,
          options: Array.isArray(q.options) ? q.options : [],
          answer: q.answer,
        })) || [];
        
        if (mappedQuestions.length > 0) {
          setQuestions(mappedQuestions);
        } else {
          toast.error("Questions could not be loaded. Please restart backend server.", {
            duration: 5000,
          });
          setQuestions([{ question: "", options: ["", "", "", ""], answer: "" }]);
        }
        
        setOriginalData({
          title: data.title || "",
          description: data.description || "",
          badgeTemplateId: data.badgeTemplateId || undefined,
          questions: mappedQuestions,
        });
        
        const originalSavedQuestions = new Set<number>();
        mappedQuestions.forEach((_: any, index: number) => {
          originalSavedQuestions.add(index);
        });
        setSavedQuestions(originalSavedQuestions);
        
        const storedData = loadFromStorage(assessmentId);
        if (storedData) {
          setTitle(storedData.title || data.title || "");
          setDescription(storedData.description || data.description || "");
          setBadgeTemplateId(storedData.badgeTemplateId || data.badgeTemplateId || undefined);
          setQuestions(storedData.questions || mappedQuestions);
          setSavedQuestions(new Set(storedData.savedQuestions || []));
          
          toast.success("Draft restored from previous session", { duration: 3000 });
        }
      }
    } catch (error) {
      console.error("Error fetching assessment:", error);
      toast.error("Failed to load assessment");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const hasUnsavedQuestions = questions.some((_, index) => !savedQuestions.has(index));
    if (hasUnsavedQuestions) {
      toast.error("Please save all questions before updating the assessment");
      return;
    }

    setLoading(true);
    try {
      const assessmentData = {
        title,
        description,
        badgeTemplateId: badgeTemplateId || undefined,
        questions: questions.map((q) => ({
          question: q.question,
          options: q.options,
          answer: q.answer,
        })),
      };

      await updateAssessment(parseInt(assessmentId), assessmentData);
      clearStorage(assessmentId);
      toast.success("Assessment updated successfully!");
      router.push("/developer/skill-assessment");
    } catch (error) {
      console.error("Error updating assessment:", error);
      toast.error("Failed to update assessment");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return false;
    }

    if (questions.length === 0) {
      toast.error("At least one question is required");
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        toast.error(`Question ${i + 1}: Question text is required`);
        return false;
      }
      if (q.options.some(opt => !opt.trim())) {
        toast.error(`Question ${i + 1}: All options must be filled`);
        return false;
      }
      if (!q.answer.trim()) {
        toast.error(`Question ${i + 1}: Correct answer is required`);
        return false;
      }
      if (!q.options.includes(q.answer)) {
        toast.error(`Question ${i + 1}: Correct answer must match one of the options`);
        return false;
      }
    }

    return true;
  };

  return {
    loading,
    fetching,
    savingQuestion,
    setSavingQuestion,
    title,
    setTitle,
    description,
    setDescription,
    badgeTemplateId,
    setBadgeTemplateId,
    questions,
    setQuestions,
    savedQuestions,
    setSavedQuestions,
    originalData,
    fetchAssessment,
    handleSubmit,
    validateForm,
  };
}
