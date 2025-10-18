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
                 prose-headings:text-foreground prose-headings:font-bold prose-headings:mt-3 sm:prose-headings:mt-4 prose-headings:mb-2 sm:prose-headings:mb-3
                 prose-h1:text-xl sm:prose-h1:text-2xl prose-h1:text-foreground prose-h1:font-extrabold prose-h1:mb-2 sm:prose-h1:mb-3
                 prose-h2:text-lg sm:prose-h2:text-xl prose-h2:text-foreground prose-h2:font-extrabold prose-h2:mb-2 sm:prose-h2:mb-3
                 prose-h3:text-base sm:prose-h3:text-lg prose-h3:text-foreground prose-h3:font-bold prose-h3:mb-2 sm:prose-h3:mb-3
                 prose-h4:text-base sm:prose-h4:text-lg prose-h4:text-foreground prose-h4:font-bold prose-h4:mb-2 sm:prose-h4:mb-3
                 prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-2 sm:prose-p:mb-3 prose-p:text-sm sm:prose-p:text-base prose-p:font-normal
                 prose-ul:text-muted-foreground prose-ul:mb-2 sm:prose-ul:mb-3 prose-ul:list-disc prose-ul:pl-6 sm:prose-ul:pl-8
                 prose-ol:text-muted-foreground prose-ol:mb-2 sm:prose-ol:mb-3 prose-ol:list-decimal prose-ol:pl-6 sm:prose-ol:pl-8
                 prose-li:text-muted-foreground prose-li:mb-2 sm:prose-li:mb-3 prose-li:text-sm sm:prose-li:text-base prose-li:font-normal prose-li:leading-relaxed
                 prose-strong:text-foreground prose-strong:font-bold prose-strong:text-base sm:prose-strong:text-lg
                 prose-em:text-foreground prose-em:italic prose-em:font-medium
                 prose-a:text-[#467EC7] prose-a:underline prose-a:hover:text-[#24CFA7] prose-a:font-medium
                 prose-blockquote:border-l-4 prose-blockquote:border-[#24CFA7] prose-blockquote:pl-3 sm:prose-blockquote:pl-4 prose-blockquote:italic
                 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs sm:prose-code:text-sm"
      style={{
        '--tw-prose-bullets': '#1f2937',
        '--tw-prose-counters': '#1f2937',
        '--tw-prose-headings': '#111827',
        '--tw-prose-body': '#6b7280',
        '--tw-prose-lead': '#4b5563',
        '--tw-prose-links': '#3b82f6',
        '--tw-prose-bold': '#111827',
        '--tw-prose-list-style-type': 'disc',
        '--tw-prose-list-style-position': 'outside',
      } as React.CSSProperties}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(description).replace(
          /<ul>/g, 
          '<ul style="list-style-type: disc !important; padding-left: 1.5rem !important; margin: 1rem 0 !important;">'
        ).replace(
          /<ol>/g, 
          '<ol style="list-style-type: decimal !important; padding-left: 1.5rem !important; margin: 1rem 0 !important;">'
        ).replace(
          /<li>/g, 
          '<li style="margin: 0.5rem 0 !important; display: list-item !important;">'
        ).replace(
          /<strong>/g, 
          '<strong style="font-weight: 700 !important; color: hsl(var(--foreground)) !important;">'
        ).replace(
          /<h1>/g, 
          '<h1 style="font-size: 1.5rem !important; font-weight: 800 !important; color: hsl(var(--foreground)) !important; margin: 1rem 0 !important;">'
        ).replace(
          /<h2>/g, 
          '<h2 style="font-size: 1.25rem !important; font-weight: 800 !important; color: hsl(var(--foreground)) !important; margin: 0.75rem 0 !important;">'
        ).replace(
          /<h3>/g, 
          '<h3 style="font-size: 1.125rem !important; font-weight: 700 !important; color: hsl(var(--foreground)) !important; margin: 0.75rem 0 !important;">'
        ).replace(
          /<h4>/g, 
          '<h4 style="font-size: 1rem !important; font-weight: 700 !important; color: hsl(var(--foreground)) !important; margin: 0.75rem 0 !important;">'
        ),
      }}
    />
  );
}
