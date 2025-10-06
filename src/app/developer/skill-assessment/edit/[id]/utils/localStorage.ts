// LocalStorage keys
const STORAGE_KEY_PREFIX = "edit-assessment-draft-";

// Helper functions for localStorage
export const saveToStorage = (assessmentId: string, data: any) => {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + assessmentId, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
};

export const loadFromStorage = (assessmentId: string) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PREFIX + assessmentId);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
    return null;
  }
};

export const clearStorage = (assessmentId: string) => {
  try {
    localStorage.removeItem(STORAGE_KEY_PREFIX + assessmentId);
  } catch (error) {
    console.error("Failed to clear localStorage:", error);
  }
};
