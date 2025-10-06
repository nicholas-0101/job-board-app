import { useState, useEffect, useCallback, useRef } from "react";

interface UseAssessmentTimerProps {
  onTimeUp: () => void;
  started: boolean;
}

export function useAssessmentTimer({ onTimeUp, started }: UseAssessmentTimerProps) {
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
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
  }, []);

  useEffect(() => {
    if (started) {
      startTimer();
    }
    return () => stopTimer();
  }, [started, startTimer, stopTimer]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getTimeWarning = () => {
    if (timeLeft <= 60) return "danger"; // 1 minute
    if (timeLeft <= 300) return "warning"; // 5 minutes
    return "normal";
  };

  return {
    timeLeft,
    formatTime,
    getTimeWarning,
    stopTimer,
  };
}
