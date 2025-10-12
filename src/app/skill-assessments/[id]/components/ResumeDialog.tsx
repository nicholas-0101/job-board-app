import { AlertCircle, Clock, Play, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ResumeDialogProps {
  show: boolean;
  interruptionInfo: {
    wasInterrupted: boolean;
    interruptionDuration?: number;
    timeSpent: number;
    remainingTime: number;
  } | null;
  onResume: () => void;
  onStartNew: () => void;
}

export default function ResumeDialog({
  show,
  interruptionInfo,
  onResume,
  onStartNew,
}: ResumeDialogProps) {
  if (!show || !interruptionInfo) return null;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#467EC7]" />
            Assessment Found
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            {interruptionInfo.wasInterrupted ? (
              <div className="space-y-2">
                <AlertCircle className="w-12 h-12 text-orange-500 mx-auto" />
                <h3 className="font-semibold text-gray-900">
                  Previous Session Detected
                </h3>
                <p className="text-sm text-gray-600">
                  We found an incomplete assessment. You were away for about{" "}
                  <strong>{interruptionInfo.interruptionDuration} minutes</strong>.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Clock className="w-12 h-12 text-[#467EC7] mx-auto" />
                <h3 className="font-semibold text-gray-900">
                  Continue Assessment
                </h3>
                <p className="text-sm text-gray-600">
                  You have an assessment in progress.
                </p>
              </div>
            )}
          </div>

          <div className="bg-[#F0F5F9] rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Time Spent:</span>
              <span className="font-medium">{formatTime(interruptionInfo.timeSpent)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Time Remaining:</span>
              <span className="font-medium text-[#467EC7]">
                {formatTime(interruptionInfo.remainingTime)}
              </span>
            </div>
          </div>

          {interruptionInfo.wasInterrupted && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-xs text-orange-700">
                <strong>Note:</strong> Time spent during the interruption was not counted 
                against your assessment time.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={onStartNew}
              variant="outline"
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Start New
            </Button>
            <Button
              onClick={onResume}
              className="flex-1 bg-[#24CFA7] hover:bg-[#24CFA7]/90 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Resume
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
