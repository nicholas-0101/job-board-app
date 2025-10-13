// Helper function to detect if text is HTML or plain text
export const isHtmlContent = (text: string): boolean => {
  return /<[^>]+>/.test(text);
};

// Convert plain text to HTML with proper formatting
export const convertPlainTextToHtml = (text: string): string => {
  if (!text) return "";

  // Split by double newlines for paragraphs
  const paragraphs = text.split("\n\n").filter((p) => p.trim());

  return paragraphs
    .map((para) => {
      const trimmed = para.trim();

      // Check if it looks like a heading (short line, usually title-like)
      if (
        trimmed.length < 50 &&
        !trimmed.includes("\n") &&
        (trimmed.match(/^[A-Z]/) ||
          trimmed.includes("Role") ||
          trimmed.includes("Responsibilities") ||
          trimmed.includes("Requirements") ||
          trimmed.includes("About") ||
          trimmed.includes("Qualifications") ||
          trimmed.includes("Skills") ||
          trimmed.includes("Benefits"))
      ) {
        return `<h3>${trimmed}</h3>`;
      }

      // Check if it contains bullet points
      if (trimmed.includes("\n") && !trimmed.startsWith("-")) {
        const lines = trimmed.split("\n").filter((l) => l.trim());
        // If all lines are short, it's likely a list
        if (lines.every((l) => l.length < 100)) {
          return (
            "<ul>" +
            lines.map((line) => `<li>${line.trim()}</li>`).join("") +
            "</ul>"
          );
        }
      }

      // Check if it starts with dash (bullet points)
      if (trimmed.startsWith("-")) {
        const items = trimmed
          .split("\n")
          .map((line) => line.replace(/^-\s*/, "").trim())
          .filter(Boolean);
        return (
          "<ul>" + items.map((item) => `<li>${item}</li>`).join("") + "</ul>"
        );
      }

      // Otherwise, treat as paragraph
      return `<p>${trimmed.replace(/\n/g, "<br>")}</p>`;
    })
    .join("\n");
};
