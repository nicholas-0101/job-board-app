import { useState } from "react";
import toast from "react-hot-toast";
import { Question } from "@/lib/skillAssessment";

export function useQuestionHandlers(
  questions: Question[],
  setQuestions: (questions: Question[]) => void,
  savedQuestions: Set<number>,
  setSavedQuestions: (questions: Set<number>) => void
) {
  const [savingQuestion, setSavingQuestion] = useState<number | null>(null);

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
    
    const newSavedQuestions = new Set<number>();
    savedQuestions.forEach(savedIndex => {
      if (savedIndex < index) {
        newSavedQuestions.add(savedIndex);
      } else if (savedIndex > index) {
        newSavedQuestions.add(savedIndex - 1);
      }
    });
    setSavedQuestions(newSavedQuestions);
  };

  const handleQuestionChange = (index: number, updatedQuestion: Question) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
    
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
    if (question.options.some(opt => !opt.trim())) {
      toast.error(`Question ${index + 1}: All options must be filled`);
      return false;
    }
    if (!question.answer.trim()) {
      toast.error(`Question ${index + 1}: Correct answer is required`);
      return false;
    }
    if (!question.options.includes(question.answer)) {
      toast.error(`Question ${index + 1}: Correct answer must match one of the options`);
      return false;
    }
    return true;
  };

  const handleSaveQuestion = async (index: number) => {
    const question = questions[index];
    
    if (!validateQuestion(question, index)) return;

    setSavingQuestion(index);
    try {
      const newSavedQuestions = new Set(savedQuestions);
      newSavedQuestions.add(index);
      setSavedQuestions(newSavedQuestions);
      
      toast.success(`Question ${index + 1} saved to draft`, { duration: 2000 });
    } catch (error) {
      toast.error("Failed to save question");
    } finally {
      setSavingQuestion(null);
    }
  };

  return {
    savingQuestion,
    handleAddQuestion,
    handleRemoveQuestion,
    handleQuestionChange,
    handleSaveQuestion,
  };
}
