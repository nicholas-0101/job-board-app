// "use client";
// import { useEffect, useState } from "react";
// import { Moon, Sun } from "lucide-react";

// export default function ThemeToggle() {
//   const [theme, setTheme] = useState<"light" | "dark">("light");

//   useEffect(() => {
//     const stored = (typeof window !== "undefined" && localStorage.getItem("theme")) as "light" | "dark" | null;
//     const systemPrefersDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
//     const nextTheme = stored ?? (systemPrefersDark ? "dark" : "light");
//     setTheme(nextTheme);
//     if (typeof document !== "undefined") {
//       document.documentElement.classList.toggle("dark", nextTheme === "dark");
//     }
//   }, []);

//   const toggle = () => {
//     const next = theme === "dark" ? "light" : "dark";
//     setTheme(next);
//     if (typeof document !== "undefined") {
//       document.documentElement.classList.toggle("dark", next === "dark");
//     }
//     if (typeof window !== "undefined") {
//       localStorage.setItem("theme", next);
//     }
//   };

//   return (
//     <button
//       aria-label="Toggle theme"
//       onClick={toggle}
//       className="p-2 rounded-lg border border-border hover:bg-secondary text-foreground/80"
//     >
//       {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
//     </button>
//   );
// }


