"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/helper/axios";

export function useContactForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiCall.post("/contact/developer", formData);
      return {
        success: true,
        title: "Message Sent!",
        message: "Your message has been successfully sent. We'll get back to you soon.",
        action: () => router.replace("/contact"),
      };
    } catch (err: any) {
      return {
        success: false,
        title: "Error",
        message: err.response?.data?.error || "Failed to send message. Please try again.",
        action: () => router.replace("/contact"),
      };
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", message: "" });
  };

  return {
    formData,
    isLoading,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
