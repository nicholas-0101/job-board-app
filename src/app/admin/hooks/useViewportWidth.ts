import { useEffect, useState } from "react";

export const useViewportWidth = () => {
  const [width, setWidth] = useState<number | null>(() =>
    typeof window === "undefined" ? null : window.innerWidth
  );

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
};
