"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge as BadgeType } from "../types";
import BadgeCard from "./BadgeCard";

interface BadgesContentProps {
  badges: BadgeType[];
  loading: boolean;
  onEdit: (badge: BadgeType) => void;
  onDelete: (badgeId: number) => void;
  onView: (badge: BadgeType) => void;
}

export function BadgesContent({ badges, loading, onEdit, onDelete, onView }: BadgesContentProps) {
  const router = useRouter();

  return (
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Badges Yet
            </h3>
            <p className="text-gray-500 mb-4">
              Create your first badge template to get started.
            </p>
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
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
