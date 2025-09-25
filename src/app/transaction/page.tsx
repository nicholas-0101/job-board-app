import { Suspense } from "react";
import TransactionContent from "@/components/transaction/TransactionContent";

function TransactionLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading transaction...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TransactionPage() {
  return (
    <Suspense fallback={<TransactionLoading />}>
      <TransactionContent />
    </Suspense>
  );
}
