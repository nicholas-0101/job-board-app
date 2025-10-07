"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useUserStore } from "@/lib/store/userStore";
import { useCompanyStore } from "@/lib/store/companyStore";
import { useRouter } from "next/navigation";
import UserOnlyGuard from "@/components/auth/UserOnlyGuard";

import ProfileTab from "./tabs/editProfileTab";
import EmailTab from "./tabs/changeEmailTab";
import PasswordTab from "./tabs/changePasswordTab";

export default function EditProfilePage() {
  return (
    <UserOnlyGuard>
      <EditProfilePageContent />
    </UserOnlyGuard>
  );
}

function EditProfilePageContent() {
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState<"profile" | "email" | "password">(
    "profile"
  );

  return (
    <div className="min-h-screen pb-30 bg-gradient-to-br from-secondary-50 to-background flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Tabs */}
        <div className="flex justify-around mb-8 border-b border-border">
          {["profile", "email", "password"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === tab
                  ? "text-[#467EC7] border-b-2 border-[#467EC7]"
                  : "text-muted-foreground hover:text-[#467EC7]"
              }`}
            >
              {tab === "profile"
                ? "Edit Profile"
                : tab === "email"
                ? "Change Email"
                : "Change Password"}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "email" && <EmailTab />}
        {activeTab === "password" && <PasswordTab />}
      </motion.div>
    </div>
  );
}