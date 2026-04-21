"use client";

import { useContactForm } from "@/lib/hooks/useContactForm";
import { useContactDialog } from "@/lib/hooks/useContactDialog";
import ContactHero from "@/components/contact/ContactHero";
import ContactFormComponent from "@/components/contact/ContactFormComponent";
import SocialMediaSection from "@/components/contact/SocialMediaSection";
import ContactDialogComponent from "@/components/contact/ContactDialogComponent";

export default function ContactUsPage() {
  const { formData, isLoading, handleChange, handleSubmit, resetForm } =
    useContactForm();
  const { dialogOpen, dialogTitle, dialogMessage, openDialog, closeDialog } =
    useContactDialog();

  const onSubmit = async (e: React.FormEvent) => {
    const result = await handleSubmit(e);
    openDialog(result.title, result.message, result.action);
    if (result.success) {
      resetForm();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/10">
      <ContactHero />
      
      <ContactFormComponent
        formData={formData}
        isLoading={isLoading}
        onChange={handleChange}
        onSubmit={onSubmit}
      />

      <SocialMediaSection />

      <ContactDialogComponent
        open={dialogOpen}
        onOpenChange={closeDialog}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={closeDialog}
      />
    </div>
  );
}
