"use client";
import { useRouter } from "next/navigation";

interface ErrorDisplayProps {
  error: string;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-400 text-lg mb-4">Error</div>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-[#467EC7] text-white rounded-lg hover:bg-[#467EC7]/80"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
