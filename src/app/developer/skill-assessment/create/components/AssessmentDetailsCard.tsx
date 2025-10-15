"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import BadgeSelector from "./BadgeSelector";

interface AssessmentDetailsCardProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  category: string;
  setCategory: (category: string) => void;
  badgeTemplateId: number | undefined;
  setBadgeTemplateId: (id: number | undefined) => void;
  passScore: number;
  setPassScore: (score: number) => void;
}

export function AssessmentDetailsCard({
  title,
  setTitle,
  description,
  setDescription,
  category,
  setCategory,
  badgeTemplateId,
  setBadgeTemplateId,
  passScore,
  setPassScore,
}: AssessmentDetailsCardProps) {
  return (
    <Card className="bg-white shadow-lg" style={{ borderColor: "#E1F1F3" }}>
      <CardHeader
        className="text-white"
        style={{ backgroundColor: "#467EC7" }}
      >
        <CardTitle className="text-base sm:text-lg">
          Assessment Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
        <div>
          <Label htmlFor="title" className="text-sm sm:text-base">
            Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Assessment title"
            required
            className="text-sm sm:text-base"
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-sm sm:text-base">
            Description
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Assessment description"
            rows={3}
            className="text-sm sm:text-base"
          />
        </div>

        <div>
          <Label htmlFor="category" className="text-sm sm:text-base">
            Category
          </Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., JavaScript, React, Node.js"
            required
            className="text-sm sm:text-base"
          />
        </div>

        <div>
          <Label htmlFor="passScore" className="text-sm sm:text-base">
            Minimum Pass Score (%)
          </Label>
          <Input
            id="passScore"
            type="number"
            min="1"
            max="100"
            value={passScore}
            onChange={(e) => setPassScore(Number(e.target.value))}
            placeholder="75"
            required
            className="w-24 sm:w-32 text-sm sm:text-base"
          />
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Students need to score at least {passScore}% to pass this
            assessment
          </p>
        </div>

        <BadgeSelector
          selectedBadgeId={badgeTemplateId}
          onSelect={setBadgeTemplateId}
        />
      </CardContent>
    </Card>
  );
}
