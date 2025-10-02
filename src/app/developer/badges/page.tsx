"use client";
import DeveloperAuthGuard from "@/components/auth/DeveloperAuthGuard";
import DeveloperLayout from "../components/DeveloperLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Plus, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge as BadgeType, Certificate } from "./types";
import { mockCertificates } from "./mockData";
import BadgeStats from "./components/BadgeStats";
import BadgeCard from "./components/BadgeCard";
import CertificateCard from "./components/CertificateCard";
import { getAllBadgeTemplates, deleteBadgeTemplate } from "@/lib/skillAssessment";
import toast from "react-hot-toast";

export default function BadgesPage() {
  const router = useRouter();
  const [badges, setBadges] = useState<BadgeType[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>(mockCertificates);
  const [activeTab, setActiveTab] = useState<"badges" | "certificates">("badges");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    setLoading(true);
    try {
      const response = await getAllBadgeTemplates();
      const badgeData = response.data?.templates || response.templates || [];
      const mappedBadges: BadgeType[] = Array.isArray(badgeData) ? badgeData.map((b: any) => ({
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
      })) : [];
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
    if (!confirm("Are you sure you want to delete this badge template?")) return;
    
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
    console.log("View badge:", badge);
  };

  const handleDownloadCertificate = (certificate: Certificate) => {
    // TODO: Implement download functionality
    console.log("Download certificate:", certificate);
  };

  const handleViewQR = (certificate: Certificate) => {
    // TODO: Implement QR view functionality
    console.log("View QR:", certificate);
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
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("badges")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "badges"
                  ? "bg-white text-[#467EC7] shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Badge Templates ({badges.length})
            </button>
            <button
              onClick={() => setActiveTab("certificates")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "certificates"
                  ? "bg-white text-[#467EC7] shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Issued Certificates ({certificates.length})
            </button>
          </div>

          {/* Content */}
          {activeTab === "badges" ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Badge Templates</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <Loader2 className="h-12 w-12 text-[#467EC7] animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading badges...</p>
                  </div>
                ) : badges.length === 0 ? (
                  <div className="text-center py-12">
                    <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Badges Yet</h3>
                    <p className="text-gray-500 mb-4">Create your first badge template to get started.</p>
                    <Button 
                      className="bg-[#467EC7] hover:bg-[#467EC7]/90"
                      onClick={() => router.push("/developer/badges/create")}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Create Badge
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {badges.map((badge) => (
                      <BadgeCard
                        key={badge.id}
                        badge={badge}
                        onEdit={handleEditBadge}
                        onDelete={handleDeleteBadge}
                        onView={handleViewBadge}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Issued Certificates</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {certificates.length === 0 ? (
                  <div className="text-center py-12">
                    <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Certificates Yet</h3>
                    <p className="text-gray-500">Certificates will appear here when users complete assessments.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((certificate) => (
                      <CertificateCard
                        key={certificate.id}
                        certificate={certificate}
                        onDownload={handleDownloadCertificate}
                        onViewQR={handleViewQR}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DeveloperLayout>
    </DeveloperAuthGuard>
  );
}
