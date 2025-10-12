import { useCallback, useEffect } from "react";

interface AssessmentProgress {
  assessmentId: number;
  currentQuestion: number;
  answers: Record<number, string>;
  startTime: string;
  timeSpent: number; // Time actually spent (excluding interruptions)
  lastActiveTime: number; // Timestamp when user was last active
  totalDuration: number; // Total assessment duration in seconds
}

export function useAssessmentPersistence(assessmentId: number) {
  const storageKey = `assessment_progress_${assessmentId}`;

  // Save progress to localStorage
  const saveProgress = useCallback((progress: Partial<AssessmentProgress>) => {
    try {
      const existingProgress = getProgress();
      const updatedProgress = {
        ...existingProgress,
        ...progress,
        assessmentId,
        lastActiveTime: Date.now(),
      };
      localStorage.setItem(storageKey, JSON.stringify(updatedProgress));
    } catch (error) {
      console.warn("Failed to save assessment progress:", error);
    }
  }, [assessmentId, storageKey]);

  // Get progress from localStorage
  const getProgress = useCallback((): AssessmentProgress | null => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return null;
      
      const progress = JSON.parse(stored) as AssessmentProgress;
      
      // Validate that the progress belongs to the current assessment
      if (progress.assessmentId !== assessmentId) {
        clearProgress();
        return null;
      }
      
      return progress;
    } catch (error) {
      console.warn("Failed to load assessment progress:", error);
      return null;
    }
  }, [assessmentId, storageKey]);

  // Clear progress from localStorage
  const clearProgress = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn("Failed to clear assessment progress:", error);
    }
  }, [storageKey]);

  // Calculate remaining time considering interruptions
  const calculateRemainingTime = useCallback((progress: AssessmentProgress): number => {
    const now = Date.now();
    const timeSinceLastActive = now - progress.lastActiveTime;
    
    // If more than 5 minutes since last active, consider it an interruption
    const isInterruption = timeSinceLastActive > 5 * 60 * 1000; // 5 minutes
    
    let totalTimeSpent = progress.timeSpent;
    
    if (!isInterruption) {
      // Add time since last active if it's continuous usage
      totalTimeSpent += Math.floor(timeSinceLastActive / 1000);
    }
    
    const remainingTime = progress.totalDuration - totalTimeSpent;
    return Math.max(0, remainingTime);
  }, []);

  // Update time spent (called periodically while user is active)
  const updateTimeSpent = useCallback(() => {
    const progress = getProgress();
    if (!progress) return;

    const now = Date.now();
    const timeSinceLastActive = now - progress.lastActiveTime;
    
    // Only update if less than 5 minutes (continuous usage)
    if (timeSinceLastActive < 5 * 60 * 1000) {
      const additionalTime = Math.floor(timeSinceLastActive / 1000);
      saveProgress({
        timeSpent: progress.timeSpent + additionalTime,
        lastActiveTime: now,
      });
    }
  }, [getProgress, saveProgress]);

  // Initialize assessment with default duration
  const initializeAssessment = useCallback((totalDuration: number) => {
    const existingProgress = getProgress();
    
    if (!existingProgress) {
      // First time starting the assessment
      const startTime = new Date().toISOString();
      saveProgress({
        currentQuestion: 0,
        answers: {},
        startTime,
        timeSpent: 0,
        lastActiveTime: Date.now(),
        totalDuration,
      });
      return {
        isResuming: false,
        currentQuestion: 0,
        answers: {},
        startTime: new Date(startTime),
        remainingTime: totalDuration,
        originalStartTime: startTime, // Keep original start time for backend validation
      };
    } else {
      // Resuming existing assessment
      const remainingTime = calculateRemainingTime(existingProgress);
      
      return {
        isResuming: true,
        currentQuestion: existingProgress.currentQuestion,
        answers: existingProgress.answers,
        startTime: new Date(existingProgress.startTime),
        remainingTime,
        timeSpent: existingProgress.timeSpent,
        originalStartTime: existingProgress.startTime, // Keep original start time for backend validation
      };
    }
  }, [getProgress, saveProgress, calculateRemainingTime]);

  // Check if there's an existing session
  const hasExistingSession = useCallback((): boolean => {
    const progress = getProgress();
    return progress !== null;
  }, [getProgress]);

  // Get interruption info for user notification
  const getInterruptionInfo = useCallback(() => {
    const progress = getProgress();
    if (!progress) return null;

    const now = Date.now();
    const timeSinceLastActive = now - progress.lastActiveTime;
    const isInterruption = timeSinceLastActive > 30 * 1000; // 30 seconds threshold for refresh detection

    if (isInterruption) {
      const interruptionMinutes = Math.floor(timeSinceLastActive / (60 * 1000));
      const interruptionSeconds = Math.floor(timeSinceLastActive / 1000);
      
      return {
        wasInterrupted: interruptionSeconds > 300, // 5 minutes for significant interruption
        interruptionDuration: interruptionMinutes,
        timeSpent: progress.timeSpent,
        remainingTime: calculateRemainingTime(progress),
        timeSinceLastActive: interruptionSeconds,
      };
    }

    return {
      wasInterrupted: false,
      timeSpent: progress.timeSpent,
      remainingTime: calculateRemainingTime(progress),
      timeSinceLastActive: Math.floor(timeSinceLastActive / 1000),
    };
  }, [getProgress, calculateRemainingTime]);

  return {
    saveProgress,
    getProgress,
    clearProgress,
    calculateRemainingTime,
    updateTimeSpent,
    initializeAssessment,
    hasExistingSession,
    getInterruptionInfo,
  };
}
