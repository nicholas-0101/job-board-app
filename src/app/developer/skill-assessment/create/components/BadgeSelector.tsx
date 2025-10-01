"use client";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllBadgeTemplates, BadgeTemplate } from "@/lib/skillAssessment";
import toast from "react-hot-toast";

interface BadgeSelectorProps {
  selectedBadgeId?: number;
  onSelect: (badgeId: number | undefined) => void;
}

export default function BadgeSelector({
  selectedBadgeId,
  onSelect,
}: BadgeSelectorProps) {
  const [badges, setBadges] = useState<BadgeTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    setLoading(true);
    try {
      const response = await getAllBadgeTemplates();
      // Response structure: { data: { templates: [...], pagination: {...} } }
      const badgeData = response.data?.templates || response.templates || [];
      const badgeArray = Array.isArray(badgeData) ? badgeData : [];
      setBadges(badgeArray);
    } catch (error: any) {
      console.error("Error fetching badges:", error);
      toast.error("Failed to load badge templates");
      setBadges([]);
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (value: string) => {
    if (value === "none") {
      onSelect(undefined);
    } else {
      onSelect(parseInt(value));
    }
  };

  return (
    <div>
      <Label htmlFor="badge">Badge Template (Optional)</Label>
      <Select
        value={selectedBadgeId?.toString() || "none"}
        onValueChange={handleValueChange}
        disabled={loading}
      >
        <SelectTrigger id="badge">
          <SelectValue placeholder={loading ? "Loading..." : "Select a badge"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No Badge</SelectItem>
          {badges.map((badge) => (
            <SelectItem key={badge.id} value={badge.id.toString()}>
              {badge.name}
              {badge.category && ` (${badge.category})`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-sm text-gray-500 mt-1">
        Users who pass this assessment will receive the selected badge
      </p>
    </div>
  );
}
