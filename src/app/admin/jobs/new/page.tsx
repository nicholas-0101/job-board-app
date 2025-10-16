"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useJobCreation } from "@/hooks/useJobCreation";
import { usePreselectionTestCreation } from "@/hooks/usePreselectionTestCreation";
import { useErrorDialog } from "@/hooks/useErrorDialog";
import JobForm from "@/components/admin/jobs/JobForm";
import TabNavigation from "@/components/admin/jobs/TabNavigation";
import PreselectionTest from "@/components/admin/jobs/PreselectionTest";
import ErrorDialog from "@/components/admin/shared/ErrorDialog";

export default function NewJobPage() {
  const router = useRouter();
  const { form, submitting, error: jobError, updateForm, onSubmit, clearError: clearJobError } = useJobCreation();
  const {
    testQuestions,
    passingScore,
    isTestActive,
    addQuestion,
    updateQuestion,
    removeQuestion,
    validateTest,
    getTestData,
    setPassingScore,
    setIsTestActive,
    error: testError,
    clearError: clearTestError,
  } = usePreselectionTestCreation();
  const { 
    dialogOpen, 
    dialogTitle, 
    dialogMessage, 
    dialogType, 
    closeDialog, 
    showWarning 
  } = useErrorDialog();
  
  const [activeTab, setActiveTab] = useState("job");

  const handleCreateJob = () => {
    // Create a synthetic event for the form submission
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent;
    
    // Clear previous errors
    clearJobError();
    clearTestError();
    
    // Always validate test if it's active
    if (isTestActive) {
      const validation = validateTest();
      if (!validation.valid) {
        showWarning(
          `You have enabled preselection test but haven't completed it yet.\n\nPlease complete all 25 questions in the test, or uncheck "Enable Preselection Test" if you don't need it.\n\nCurrent status: ${validation.message}`,
          "⚠️ Preselection Test Required"
        );
        return;
      }
    }

    // Get test data if test is active
    const testData = isTestActive ? getTestData() : undefined;
    
    // Submit with test data
    onSubmit(syntheticEvent, testData);
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    
    // Clear previous errors
    clearJobError();
    clearTestError();
    
    // Always validate test if it's active, regardless of which tab we're on
    if (isTestActive) {
      const validation = validateTest();
      if (!validation.valid) {
        // If we're on job tab and test is incomplete, show notification
        if (activeTab === "job") {
          showWarning(
            `You have enabled preselection test but haven't completed it yet.\n\nPlease go to "Pre-Selection Test" tab to complete the test, or uncheck "Enable Preselection Test" if you don't need it.\n\nCurrent status: ${validation.message}`,
            "⚠️ Preselection Test Required"
          );
        }
        return;
      }
    }

    // Get test data if test is active
    const testData = isTestActive ? getTestData() : undefined;
    
    // Submit with test data
    await onSubmit(e, testData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Dialog */}
      <ErrorDialog
        open={dialogOpen}
        onOpenChange={closeDialog}
        title={dialogTitle}
        message={dialogMessage}
        type={dialogType}
        onConfirm={closeDialog}
      />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create Job Posting</h1>
              <p className="text-gray-600">Fill in the job details and create pre-selection test</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Job Details Tab */}
        {activeTab === "job" && (
          <JobForm
            form={form}
            submitting={submitting}
            error={jobError}
            onUpdateForm={updateForm}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}

        {/* Pre-Selection Test Tab */}
        {activeTab === "test" && (
          <PreselectionTest 
            testQuestions={testQuestions}
            passingScore={passingScore}
            isTestActive={isTestActive}
            testLoaded={true}
            setPassingScore={setPassingScore}
            setIsTestActive={setIsTestActive}
            addQuestion={addQuestion}
            updateQuestion={updateQuestion}
            removeQuestion={removeQuestion}
            saveTest={async () => {
              const validation = validateTest();
              if (!validation.valid) {
                return;
              }
              // Test is valid, show success message
              console.log("Test validated successfully!");
            }}
            onCreateJob={handleCreateJob}
            isCreateMode={true}
          />
        )}
      </div>
    </div>
  );
}


