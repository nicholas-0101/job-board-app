"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Building2 } from "lucide-react";

interface CompanyInfoBannerProps {
  companyInfo: any;
}

export function CompanyInfoBanner({ companyInfo }: CompanyInfoBannerProps) {
  if (!companyInfo) return null;

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="shadow-lg border-l-4 border-l-[#24CFA7] bg-gradient-to-r from-white to-primary-50/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            {companyInfo.logoUrl ? (
              <img
                src={companyInfo.logoUrl}
                alt={companyInfo.name}
                className="w-20 h-20 rounded-xl object-cover border-2 border-[#24CFA7] shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#24CFA7] to-[#467EC7] flex items-center justify-center shadow-md">
                <Building2 className="w-10 h-10 text-white" />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">
                {companyInfo.name}
              </h2>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  📧 {companyInfo.email}
                </span>
                {companyInfo.locationCity && (
                  <span className="flex items-center gap-1">
                    📍 {companyInfo.locationCity}
                  </span>
                )}
                {companyInfo.website && (
                  <a
                    href={companyInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#467EC7] hover:underline"
                  >
                    🌐 Website
                  </a>
                )}
              </div>
              {companyInfo.description && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {companyInfo.description.replace(/<[^>]*>/g, "")}
                </p>
              )}
            </div>
            <Link href="/admin/profile/edit">
              <Button className="gap-2 bg-[#24CFA7] hover:bg-[#1fc39c] shadow-md">
                <Edit className="w-4 h-4" />
                Edit Company
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
