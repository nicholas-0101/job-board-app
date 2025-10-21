import { useRouter } from "next/navigation";
import { fetchPreselectionTest } from "@/lib/preselection";
import { apiCall } from "@/helper/axios";
import { TestQuestion } from "./usePreselectionTestState";

export function usePreselectionTestActions(
  jobId: number,
  shouldFetch: boolean,
  testQuestions: TestQuestion[],
  passingScore: number,
  setTestQuestions: (questions: TestQuestion[]) => void,
  setPassingScore: (score: number) => void,
  setIsTestActive: (active: boolean) => void,
  setTestLoaded: (loaded: boolean) => void
) {
  const router = useRouter();

  const loadTest = async () => {
    if (!shouldFetch || !jobId) {
      setTestLoaded(true);
      return;
    }

    try {
      const test = await fetchPreselectionTest(jobId);
      if (test) {
        setIsTestActive(!!test.isActive);
        setPassingScore(test.passingScore ?? 0);
        const mapped = (test.questions || []).map((q: any) => ({
          question: q.question || "",
          options: Array.isArray(q.options) ? q.options : ["", "", "", ""],
          answer: (q as any).answer || "",
        }));
        setTestQuestions(mapped);
      }
    } catch (error) {
      // Silently ignore - no test exists
    }
    setTestLoaded(true);
  };

  const addQuestion = () => {
    if (testQuestions.length >= 25) return;
    setTestQuestions([...testQuestions, { question: "", options: ["", "", "", ""], answer: "" }]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...testQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setTestQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    setTestQuestions(testQuestions.filter((_, i) => i !== index));
  };

  const validateTest = () => {
    // Check if test has exactly 25 questions
    if (testQuestions.length !== 25) {
      alert(`Test harus memiliki tepat 25 soal. Saat ini ada ${testQuestions.length} soal. Silakan tambahkan ${25 - testQuestions.length} soal lagi.`);
      return false;
    }
    
    // Check for incomplete questions
    const incompleteQuestions = [];
    for (let i = 0; i < testQuestions.length; i++) {
      const q = testQuestions[i];
      if (!q.question.trim()) {
        incompleteQuestions.push(`Soal ${i + 1}: Pertanyaan kosong`);
      } else if (!Array.isArray(q.options) || q.options.length !== 4) {
        incompleteQuestions.push(`Soal ${i + 1}: Harus ada 4 pilihan jawaban`);
      } else if (q.options.some((opt) => !opt.trim())) {
        incompleteQuestions.push(`Soal ${i + 1}: Semua pilihan jawaban harus diisi`);
      } else if (!q.answer.trim() || !q.options.includes(q.answer)) {
        incompleteQuestions.push(`Soal ${i + 1}: Jawaban benar harus dipilih dari pilihan yang ada`);
      }
    }
    
    if (incompleteQuestions.length > 0) {
      alert(`Test belum lengkap. Masalah yang ditemukan:\n\n${incompleteQuestions.join('\n')}\n\nSilakan lengkapi semua soal sebelum mengaktifkan test.`);
      return false;
    }

    return true;
  };

  const saveTest = async () => {
    if (!validateTest()) return;

    try {
      await apiCall.post(`/preselection/jobs/${jobId}/tests`, {
        questions: testQuestions,
        passingScore,
        isActive: true,
      });
      alert("Pre-selection test saved successfully!");
      router.push("/admin/preselection");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to save test");
    }
  };

  const saveDraft = async () => {
    // Validate existing questions (but allow incomplete)
    for (let i = 0; i < testQuestions.length; i++) {
      const q = testQuestions[i];
      if (q.question.trim() && q.options.some(opt => opt.trim()) && q.answer.trim()) {
        if (!Array.isArray(q.options) || q.options.length !== 4)
          return alert(`Question ${i + 1} must have 4 options`);
        if (q.options.some((opt) => !opt.trim()))
          return alert(`All options must be filled for question ${i + 1}`);
        if (!q.options.includes(q.answer))
          return alert(`Answer for question ${i + 1} must match one of the options`);
      }
    }

    try {
      await apiCall.post(`/preselection/jobs/${jobId}/tests`, {
        questions: testQuestions,
        passingScore,
        isActive: false,
      });
      alert(`Draft saved successfully! (${testQuestions.length}/25 questions)`);
      router.push("/admin/preselection");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to save draft");
    }
  };

  const deleteTest = async () => {
    if (!confirm("Are you sure you want to delete this preselection test and all its questions?")) {
      return;
    }
    try {
      await apiCall.delete(`/preselection/jobs/${jobId}/tests`);
      alert("Preselection test deleted successfully!");
      
      setTestQuestions([]);
      setIsTestActive(false);
      setPassingScore(20);
      
      router.push("/admin/preselection");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to delete test");
    }
  };

  return {
    loadTest,
    addQuestion,
    updateQuestion,
    removeQuestion,
    saveTest,
    saveDraft,
    deleteTest,
  };
}
