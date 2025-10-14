import { useState, useEffect, useCallback, useRef } from "react";

interface UseAssessmentTimerProps {
  onTimeUp: () => void;
  started: boolean;
  initialTime?: number; // Allow setting initial time for resume
}

export function useAssessmentTimer({
  onTimeUp,
  started,
  initialTime,
}: UseAssessmentTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime || 30 * 60); // 30 minutes default
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeUpCalledRef = useRef<boolean>(false);

  const startTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1 && !timeUpCalledRef.current) {
          timeUpCalledRef.current = true;
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [onTimeUp]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    timeUpCalledRef.current = false; // Reset for next use
  }, []);

  useEffect(() => {
    if (started) {
      startTimer();
    }
    return () => stopTimer();
  }, [started, startTimer, stopTimer]);

  // Update time when initialTime changes (for resume)
  useEffect(() => {
    if (initialTime !== undefined) {
      setTimeLeft(initialTime);
    }
  }, [initialTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const getTimeWarning = () => {
    if (timeLeft <= 60) return "danger"; // last 60 seconds
    if (timeLeft <= 5 * 60) return "warning"; // last 5 minutes
    return "normal";
  };

  return {
    timeLeft,
    formatTime,
    getTimeWarning,
    stopTimer,
  };
}
