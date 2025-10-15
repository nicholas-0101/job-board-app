"use client";
import DeveloperAuthGuard from "@/components/auth/DeveloperAuthGuard";
import DeveloperLayout from "../components/DeveloperLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge as BadgeType, Certificate } from "./types";
import { mockCertificates } from "./mockData";
import BadgeStats from "./components/BadgeStats";
import { TabNavigation } from "./components/TabNavigation";
import { BadgesContent } from "./components/BadgesContent";
import { CertificatesContent } from "./components/CertificatesContent";
import {
  getAllBadgeTemplates,
  deleteBadgeTemplate,
} from "@/lib/skillAssessment";
import toast from "react-hot-toast";

export default function BadgesPage() {
  const router = useRouter();
  const [badges, setBadges] = useState<BadgeType[]>([]);
  const [certificates, setCertificates] =
    useState<Certificate[]>(mockCertificates);
  const [activeTab, setActiveTab] = useState<"badges" | "certificates">(
    "badges"
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    setLoading(true);
    try {
      const response = await getAllBadgeTemplates();
      const badgeData = response.data?.templates || response.templates || [];
      const mappedBadges: BadgeType[] = Array.isArray(badgeData)
        ? badgeData.map((b: any) => ({
            id: b.id,
            name: b.name,
            description: b.description || "",
            icon: b.icon || "🏆",
            color: b.color || "#467EC7",
            category: b.category || "General",
            requirements: b.requirements || "Complete assessment",
            issuedCount: b._count?.badges || 0,
            status: (b.status || "active") as "active" | "draft" | "archived",
            createdAt: b.createdAt,
          }))
        : [];
      setBadges(mappedBadges);
    } catch (error: any) {
      console.error("Error fetching badges:", error);
      toast.error("Failed to load badges");
    } finally {
      setLoading(false);
    }
  };

  const handleEditBadge = (badge: BadgeType) => {
    router.push(`/developer/badges/edit/${badge.id}`);
  };

  const handleDeleteBadge = async (badgeId: number) => {
    if (!confirm("Are you sure you want to delete this badge template?"))
      return;

    try {
      await deleteBadgeTemplate(badgeId);
      toast.success("Badge template deleted successfully");
      fetchBadges(); // Refresh list
    } catch (error: any) {
      console.error("Error deleting badge:", error);
      toast.error(error.response?.data?.message || "Failed to delete badge");
    }
  };

  const handleViewBadge = (badge: BadgeType) => {
    // TODO: Implement view functionality
  };

  const handleDownloadCertificate = (certificate: Certificate) => {
    // TODO: Implement download functionality
  };

  const handleViewQR = (certificate: Certificate) => {
    // TODO: Implement QR view functionality
  };

  return (
    <DeveloperAuthGuard>
      <DeveloperLayout>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 rounded-lg">
            <div className="px-6 py-8">
              <div className="flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
                <div className="w-full sm:w-auto text-center sm:text-left">
                  <h1 className="text-3xl font-bold text-[#467EC7]">
                    Badge & Certificate System
                  </h1>
                  <p className="text-lg text-gray-600 mt-2">
                    Manage achievement badges and digital certificates
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    className="bg-[#467EC7] hover:bg-[#467EC7]/90"
                    onClick={() => router.push("/developer/badges/create")}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Create Badge
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <BadgeStats badges={badges} certificates={certificates} />

          {/* Tab Navigation */}
          <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            badgesCount={badges.length}
            certificatesCount={certificates.length}
          />

          {/* Content */}
          {activeTab === "badges" ? (
            <BadgesContent
              badges={badges}
              loading={loading}
              onEdit={handleEditBadge}
              onDelete={handleDeleteBadge}
              onView={handleViewBadge}
            />
          ) : (
            <CertificatesContent
              certificates={certificates}
              onDownload={handleDownloadCertificate}
              onViewQR={handleViewQR}
            />
          )}
        </div>
      </DeveloperLayout>
    </DeveloperAuthGuard>
  );
}
