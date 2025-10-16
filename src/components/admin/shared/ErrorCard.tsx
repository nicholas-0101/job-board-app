interface ErrorCardProps {
  message: string;
  className?: string;
}

export default function ErrorCard({ message, className = "" }: ErrorCardProps) {
  return (
    <div className={`border-red-200 bg-red-50 ${className}`}>
      <div className="p-6 text-center">
        <p className="text-red-600 font-medium">{message}</p>
      </div>
    </div>
  );
}
