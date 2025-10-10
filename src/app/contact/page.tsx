"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Instagram, Facebook, Twitter, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/helper/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ContactUsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogAction, setDialogAction] = useState<(() => void) | null>(null);

  const openDialog = (title: string, message: string, action?: () => void) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogAction(() => action || null);
    setDialogOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiCall.post("/contact/developer", formData);
      openDialog(
        "Message Sent!",
        "Your message has been successfully sent. We'll get back to you soon.",
        () => router.replace("/contact")
      );
      setFormData({ name: "", email: "", message: "" });
    } catch (err: any) {
      openDialog(
        "Error",
        err.response?.data?.error || "Failed to send message. Please try again.",
        () => router.replace("/contact")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/10 py-20">
        <div className="max-w-6xl mx-auto text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-[#467EC7] mb-4"
          >
            Get in <span className="text-[#24CFA7]">Touch</span> with Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Have questions, suggestions, or want to collaborate? Fill out the form below or reach us via social media.
          </motion.p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border rounded-2xl p-10 shadow-sm hover:shadow-md transition-all"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block mb-2 font-medium text-foreground">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#467EC7]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 font-medium text-foreground">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#467EC7]"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block mb-2 font-medium text-foreground">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message..."
                rows={6}
                required
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#467EC7]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#24CFA7] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </motion.div>
      </section>

      {/* Social Media Section */}
      <section className="py-20 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-[#467EC7] mb-6"
        >
          Follow Us
        </motion.h2>
        <motion.div
          className="flex justify-center gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <a
            href="https://www.instagram.com/workoo"
            className="text-[#E1306C] p-4 rounded-full hover:scale-105 hover:bg-neutral-100 transition transform"
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a
            href="https://facebook.com/workoo"
            className="text-[#1877F2] p-4 rounded-full hover:scale-105 hover:bg-neutral-100 transition transform"
          >
            <Facebook className="w-6 h-6" />
          </a>
          <a
            href="https://x.com/workoo"
            className="text-[#1DA1F2] p-4 rounded-full hover:scale-105 hover:bg-neutral-100 transition transform"
          >
            <Twitter className="w-6 h-6" />
          </a>
        </motion.div>
      </section>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md !rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#467EC7]">{dialogTitle}</DialogTitle>
            <DialogDescription className="text-lg text-muted-foreground">
              {dialogMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setDialogOpen(false);
                dialogAction?.();
              }}
              className="bg-[#24CFA7] hover:bg-[#24CFA7]/80 text-white rounded-lg"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
