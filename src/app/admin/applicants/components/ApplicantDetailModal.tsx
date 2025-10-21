"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap } from "lucide-react";
import { ApplicantDetailModalHeader } from "./ApplicantDetailModalHeader";
import { ApplicantDetailModalBadges } from "./ApplicantDetailModalBadges";
import { ApplicantDetailModalBasicInfo } from "./ApplicantDetailModalBasicInfo";
import { ApplicantDetailModalCvSection } from "./ApplicantDetailModalCvSection";
import { ApplicantDetailModalActions } from "./ApplicantDetailModalActions";

export type ApplicantDetail = {
  applicationId: number;
  userName: string;
  userEmail: string;
  profilePicture?: string | null;
  isPriority?: boolean;
  status: string;
  score: number | null;
  preselectionPassed?: boolean;
  expectedSalary?: number | null;
  appliedAt: string | number | Date;
  cvFile?: string | null;
  // Additional detail fields
  phoneNumber?: string;
  address?: string;
  education?: string;
  experience?: string;
  skills?: string[];
  coverLetter?: string;
  age?: number;
};

export function ApplicantDetailModal({
  applicant,
  isOpen,
  onClose,
  onUpdateStatus,
}: {
  applicant: ApplicantDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (applicationId: number, status: string) => void;
}) {
  if (!applicant) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <ApplicantDetailModalHeader applicant={applicant} />

        <div className="space-y-6">
          {/* Status and Priority */}
          <ApplicantDetailModalBadges
            status={applicant.status}
            isPriority={applicant.isPriority}
            score={applicant.score}
            preselectionPassed={applicant.preselectionPassed}
          />

          {/* Basic Information */}
          <ApplicantDetailModalBasicInfo applicant={applicant} />

          {/* Education */}
          {applicant.education && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{applicant.education}</p>
              </CardContent>
            </Card>
          )}

          {/* Experience */}
          {applicant.experience && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{applicant.experience}</p>
              </CardContent>
            </Card>
          )}

          {/* Skills */}
          {applicant.skills && applicant.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {applicant.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cover Letter */}
          {applicant.coverLetter && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cover Letter</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{applicant.coverLetter}</p>
              </CardContent>
            </Card>
          )}

          {/* CV Preview */}
          {applicant.cvFile && (
            <ApplicantDetailModalCvSection
              cvFile={applicant.cvFile}
              userName={applicant.userName}
            />
          )}

          {/* Action Buttons */}
          <ApplicantDetailModalActions
            applicationId={applicant.applicationId}
            status={applicant.status}
            onUpdateStatus={onUpdateStatus}
            onClose={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
