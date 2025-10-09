// Helper functions (max 15 lines each)
export const formatCurrency = (amount: number): string => {
  return `IDR ${amount.toLocaleString()}`;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getTimeRemaining = (expiryDate: string): string => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diff = expiry.getTime() - now.getTime();
  
  if (diff <= 0) return "Expired";
  
  const minutes = Math.floor(diff / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return `${minutes}m ${seconds}s remaining`;
};

export const getStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'expired': return 'bg-red-100 text-red-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
