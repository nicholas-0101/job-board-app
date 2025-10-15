"use client";
import { useRouter } from "next/navigation";

export function NoTestAvailable() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-gray-600 text-lg mb-4">No Test Available</div>
        <p className="text-gray-500">
          This job doesn't have a pre-selection test.
        </p>
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
