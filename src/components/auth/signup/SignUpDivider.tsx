"use client";

interface SignUpDividerProps {
  children: React.ReactNode;
}

export default function SignUpDivider({ children }: SignUpDividerProps) {
  return (
    <div className="relative my-6 sm:my-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border"></div>
      </div>
      <div className="relative flex justify-center text-xs sm:text-sm">
        <span className="px-3 sm:px-4 bg-background text-muted-foreground">
          {children}
        </span>
      </div>
    </div>
  );
}
