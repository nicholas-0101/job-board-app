interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export default function LoadingSpinner({ 
  message = "Loading...", 
  size = "md" 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-16 w-16"
  };

  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className={`animate-spin rounded-full border-b-2 border-[#24CFA7] mx-auto mb-4 ${sizeClasses[size]}`}></div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
