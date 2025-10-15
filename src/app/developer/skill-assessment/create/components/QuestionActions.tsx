"use client";
import { Button } from "@/components/ui/button";
import { Trash2, Save, Check, Loader2, Plus } from "lucide-react";

interface QuestionActionsProps {
  index: number;
  isSaved: boolean;
  isSaving: boolean;
  isLastQuestion: boolean;
  canAddMore: boolean;
  canRemove: boolean;
  onSave?: (index: number) => void;
  onRemove: (index: number) => void;
  onAddQuestion?: () => void;
}

export function QuestionActions({
  index,
  isSaved,
  isSaving,
  isLastQuestion,
  canAddMore,
  canRemove,
  onSave,
  onRemove,
  onAddQuestion,
}: QuestionActionsProps) {
  return (
    <div className="space-y-3 mt-4 lg:mt-6 lg:min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        {onSave && (
          <Button
            type="button"
            variant={isSaved ? "outline" : "default"}
            size="sm"
            onClick={() => onSave(index)}
            disabled={isSaving}
            className={`text-xs sm:text-sm ${
              isSaved
                ? "text-green-600 border-green-600"
                : "bg-[#467EC7] hover:bg-[#467EC7]/90"
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 animate-spin" />
                <span className="hidden sm:inline">Saving...</span>
                <span className="sm:hidden">Saving...</span>
              </>
            ) : isSaved ? (
              <>
                <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">Saved</span>
                <span className="sm:hidden">Saved</span>
              </>
            ) : (
              <>
                <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">Save Question</span>
                <span className="sm:hidden">Save</span>
              </>
            )}
          </Button>
        )}
        {canRemove && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => onRemove(index)}
            className="text-xs sm:text-sm"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        )}
      </div>

      {/* Add Question button - shows after save and only on last question */}
      {isSaved && isLastQuestion && canAddMore && onAddQuestion && (
        <div className="flex justify-center">
          <Button
            type="button"
            onClick={onAddQuestion}
            size="sm"
            className="bg-gray-800 hover:bg-gray-700 text-white text-xs sm:text-sm"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Add Next Question</span>
            <span className="sm:hidden">Add Next</span>
          </Button>
        </div>
      )}
    </div>
  );
}
