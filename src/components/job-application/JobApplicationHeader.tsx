"use client";

interface JobApplicationHeaderProps {
  jobName: string;
}

export default function JobApplicationHeader({ jobName }: JobApplicationHeaderProps) {
  return (
    <h1 className="text-2xl text-center font-bold text-[#467EC7] mb-6">
      Apply for {jobName}
    </h1>
  );
}
