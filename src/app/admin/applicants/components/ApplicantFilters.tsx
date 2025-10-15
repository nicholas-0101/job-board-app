"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, RefreshCw } from "lucide-react";

interface ApplicantFiltersProps {
  searchName: string;
  setSearchName: (value: string) => void;
  education: string;
  setEducation: (value: string) => void;
  ageMin: string;
  setAgeMin: (value: string) => void;
  ageMax: string;
  setAgeMax: (value: string) => void;
  salaryMin: string;
  setSalaryMin: (value: string) => void;
  salaryMax: string;
  setSalaryMax: (value: string) => void;
  onApplyFilters: () => void;
}

export default function ApplicantFilters({
  searchName,
  setSearchName,
  education,
  setEducation,
  ageMin,
  setAgeMin,
  ageMax,
  setAgeMax,
  salaryMin,
  setSalaryMin,
  salaryMax,
  setSalaryMax,
  onApplyFilters,
}: ApplicantFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              placeholder="Search by name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Education</label>
            <Input
              placeholder="Education level..."
              value={education}
              onChange={(e) => setEducation(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Age Range</label>
            <div className="flex gap-2">
              <Input
                placeholder="Min"
                type="number"
                value={ageMin}
                onChange={(e) => setAgeMin(e.target.value)}
              />
              <Input
                placeholder="Max"
                type="number"
                value={ageMax}
                onChange={(e) => setAgeMax(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Salary Range</label>
            <div className="flex gap-2">
              <Input
                placeholder="Min"
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
              />
              <Input
                placeholder="Max"
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
              />
            </div>
          </div>
        </div>
        <Button onClick={onApplyFilters} className="w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
}
