"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Edit } from "lucide-react";

export function CompanyBanner({ companyInfo }: { companyInfo: any }) {
  if (!companyInfo) return null;
  
  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-l-4 border-l-[#24CFA7] bg-gradient-to-r from-white to-primary-50/30">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start items-center gap-4 sm:gap-6">
            {companyInfo.logoUrl ? (
              <img
                src={companyInfo.logoUrl}
                alt={companyInfo.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-[#24CFA7] shadow-md"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-[#24CFA7] to-[#467EC7] flex items-center justify-center shadow-md">
                <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            )}
            <div className="flex-1 w-full">
              <h2 className="text-2xl font-bold mb-2">{companyInfo.name}</h2>
              
              {/* Basic Info */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1.5">
                  <span className="text-gray-500">📧</span>
                  {companyInfo.email}
                </span>
                {companyInfo.locationCity && (
                  <span className="flex items-center gap-1.5">
                    <span className="text-gray-500">📍</span>
                    {companyInfo.locationCity}
                  </span>
                )}
                {companyInfo.website && (
                  <a href={companyInfo.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#467EC7] hover:underline transition-colors">
                    <span className="text-gray-500">🌐</span>
                    Website
                  </a>
                )}
              </div>

              {/* Social Media Links */}
              {(companyInfo.socials?.facebook || companyInfo.socials?.instagram || companyInfo.socials?.twitter || companyInfo.socials?.linkedin) && (
                <div className="flex flex-wrap gap-3 mb-3">
                  {companyInfo.socials?.facebook && (
                    <a href={companyInfo.socials.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 transition-colors text-sm font-medium">
                      <span>📘</span>
                      Facebook
                    </a>
                  )}
                  {companyInfo.socials?.instagram && (
                    <a href={companyInfo.socials.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#E4405F]/10 text-[#E4405F] hover:bg-[#E4405F]/20 transition-colors text-sm font-medium">
                      <span>📷</span>
                      Instagram
                    </a>
                  )}
                  {companyInfo.socials?.twitter && (
                    <a href={companyInfo.socials.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-colors text-sm font-medium">
                      <span>🐦</span>
                      Twitter
                    </a>
                  )}
                  {companyInfo.socials?.linkedin && (
                    <a href={companyInfo.socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5]/20 transition-colors text-sm font-medium">
                      <span>💼</span>
                      LinkedIn
                    </a>
                  )}
                </div>
              )}

              {/* Description */}
              {companyInfo.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {companyInfo.description.replace(/<[^>]*>/g, "")}
                </p>
              )}
            </div>
            <div className="w-full sm:w-auto sm:self-start">
              <Link href="/admin/profile/edit">
                <Button className="w-full sm:w-auto gap-2 bg-[#24CFA7] hover:bg-[#1fc39c] shadow-md">
                  <Edit className="w-4 h-4" />
                  Edit Company
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


