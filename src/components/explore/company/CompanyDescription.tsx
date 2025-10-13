"use client";

import DOMPurify from "dompurify";

interface CompanyDescriptionProps {
  description: string;
}

export default function CompanyDescription({ description }: CompanyDescriptionProps) {
  if (!description) return null;

  return (
    <div
      className="prose prose-sm sm:prose-base text-muted-foreground max-w-none mt-3 sm:mt-4
                 prose-headings:text-foreground prose-headings:font-semibold prose-headings:mt-3 sm:prose-headings:mt-4 prose-headings:mb-2 sm:prose-headings:mb-3
                 prose-h1:text-xl sm:prose-h1:text-2xl prose-h1:text-foreground prose-h1:font-bold prose-h1:mb-2 sm:prose-h1:mb-3
                 prose-h2:text-lg sm:prose-h2:text-xl prose-h2:text-foreground prose-h2:font-bold prose-h2:mb-2 sm:prose-h2:mb-3
                 prose-h3:text-base sm:prose-h3:text-lg prose-h3:text-foreground prose-h3:font-semibold prose-h3:mb-2 sm:prose-h3:mb-3
                 prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-2 sm:prose-p:mb-3 prose-p:text-sm sm:prose-p:text-base
                 prose-ul:text-muted-foreground prose-ul:mb-2 sm:prose-ul:mb-3 prose-ul:list-disc prose-ul:pl-4 sm:prose-ul:pl-6
                 prose-ol:text-muted-foreground prose-ol:mb-2 sm:prose-ol:mb-3 prose-ol:list-decimal prose-ol:pl-4 sm:prose-ol:pl-6
                 prose-li:text-muted-foreground prose-li:mb-1 sm:prose-li:mb-2 prose-li:text-sm sm:prose-li:text-base
                 prose-strong:text-foreground prose-strong:font-semibold
                 prose-em:text-foreground prose-em:italic
                 prose-a:text-[#467EC7] prose-a:underline prose-a:hover:text-[#24CFA7]
                 prose-blockquote:border-l-4 prose-blockquote:border-[#24CFA7] prose-blockquote:pl-3 sm:prose-blockquote:pl-4 prose-blockquote:italic
                 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs sm:prose-code:text-sm"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(description),
      }}
    />
  );
}
