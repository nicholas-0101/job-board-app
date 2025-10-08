export default function TransactionLoading() {
  return (
    <div className="min-h-screen bg-[#F0F5F9] py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#467EC7] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading transaction details...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
