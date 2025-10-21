"use client";
import { Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ApplicantFilters(props: {
  searchName: string;
  setSearchName: (v: string) => void;
  education: string;
  setEducation: (v: string) => void;
  sortBy: "appliedAt" | "expectedSalary" | "age";
  setSortBy: (v: "appliedAt" | "expectedSalary" | "age") => void;
  ageMin: string;
  setAgeMin: (v: string) => void;
  ageMax: string;
  setAgeMax: (v: string) => void;
  salaryMin: string;
  setSalaryMin: (v: string) => void;
  salaryMax: string;
  setSalaryMax: (v: string) => void;
  onApply: () => void;
}) {
  const {
    searchName,
    setSearchName,
    education,
    setEducation,
    sortBy,
    setSortBy,
    ageMin,
    setAgeMin,
    ageMax,
    setAgeMax,
    salaryMin,
    setSalaryMin,
    salaryMax,
    setSalaryMax,
    onApply,
  } = props;

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#467EC7]" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-12 gap-3 mb-4">
          <div className="col-span-12 sm:col-span-6 md:col-span-4">
            <label className="block text-sm font-medium mb-1.5">Search Name</label>
            <Input
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Search name"
              className="rounded-xl h-10"
            />
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-4">
            <label className="block text-sm font-medium mb-1.5">Education</label>
            <Input
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="e.g., S1, S2..."
              className="rounded-xl h-10"
            />
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-4">
            <label className="block text-sm font-medium mb-1.5">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full h-10 px-3 border rounded-xl bg-background hover:border-primary transition-colors"
            >
              <option value="appliedAt">Applied Date</option>
              <option value="expectedSalary">Expected Salary</option>
              <option value="age">Age</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-3 min-w-0">
          <div className="col-span-12 sm:col-span-6 md:col-span-3">
            <label className="block text-sm font-medium mb-1.5">Min Age</label>
            <Input
              type="number"
              value={ageMin}
              onChange={(e) => setAgeMin(e.target.value)}
              placeholder="Min"
              className="rounded-xl h-10"
            />
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-3">
            <label className="block text-sm font-medium mb-1.5">Max Age</label>
            <Input
              type="number"
              value={ageMax}
              onChange={(e) => setAgeMax(e.target.value)}
              placeholder="Max"
              className="rounded-xl h-10"
            />
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-3">
            <label className="block text-sm font-medium mb-1.5">Min Salary</label>
            <Input
              type="number"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              placeholder="Min"
              className="rounded-xl h-10"
            />
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-3">
            <label className="block text-sm font-medium mb-1.5">Max Salary</label>
            <Input
              type="number"
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
              placeholder="Max"
              className="rounded-xl h-10"
            />
          </div>
        </div>
        <div className="mt-4 flex w-full justify-stretch md:justify-end">
          <Button onClick={onApply} className="w-full md:w-auto text-sm bg-[#24CFA7] hover:bg-[#1fc39c]">
            <Search className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


