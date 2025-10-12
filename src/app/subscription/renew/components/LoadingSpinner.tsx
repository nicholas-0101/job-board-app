export const LoadingSpinner = () => (
  <div className="min-h-screen bg-[#F0F5F9] py-8">
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#24CFA7] mx-auto mb-4"></div>
        <p className="text-[#A3B6CE]">Loading renewal information...</p>
      </div>
    </div>
  </div>
);
