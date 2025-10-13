// Format currency value to Indonesian Rupiah format
export const formatRupiah = (value: string | number): string => {
  const numeric =
    typeof value === "number"
      ? value
      : value.replace(/\D/g, "");
  return numeric
    ? Number(numeric).toLocaleString("id-ID")
    : "";
};
