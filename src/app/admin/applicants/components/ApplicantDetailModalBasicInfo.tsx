"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign
} from "lucide-react";

interface ApplicantDetailModalBasicInfoProps {
  applicant: {
    userEmail: string;
    phoneNumber?: string;
    address?: string;
    age?: number;
    expectedSalary?: number | null;
    appliedAt: string | number | Date;
  };
}

export function ApplicantDetailModalBasicInfo({ applicant }: ApplicantDetailModalBasicInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="w-5 h-5" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{applicant.userEmail}</span>
          </div>
          {applicant.phoneNumber && (
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{applicant.phoneNumber}</span>
            </div>
          )}
          {applicant.address && (
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{applicant.address}</span>
            </div>
          )}
          {applicant.age && (
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{applicant.age} years old</span>
            </div>
          )}
          {applicant.expectedSalary && (
            <div className="flex items-center gap-3">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Rp {applicant.expectedSalary.toLocaleString()}</span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Applied: {new Date(applicant.appliedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
