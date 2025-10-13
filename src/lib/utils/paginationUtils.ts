export function getVisiblePages(current: number, total: number, maxVisible = 5): (number | string)[] {
  const pages: (number | string)[] = [];
  if (total <= maxVisible + 2) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    let start = Math.max(current - 1, 2);
    let end = Math.min(current + 1, total - 1);
    if (start > 2) pages.push("…");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < total - 1) pages.push("…");
    pages.push(total);
  }
  return pages;
}