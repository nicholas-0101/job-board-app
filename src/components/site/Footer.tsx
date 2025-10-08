"use client"
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const hiddenRoutes = ["/auth", "/profile", "/go-to-signin"];
  const hideFooter = hiddenRoutes.some((route) => pathname.startsWith(route));
  if (hideFooter) {
    return null;
  }
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-4 text-sm text-muted-foreground">
        <div>
          <div className="text-[#467ec7] text-3xl font-bold">
            Work<span className="text-[#24cfa7]">oo</span>
          </div>
          <p className="mt-2 max-w-sm text-md font-semibold">
            Seek your next move
          </p>
        </div>
        <div>
          <div className="font-semibold text-foreground">Product</div>
          <ul className="mt-3 space-y-2">
            <li>
              <a className="hover:text-primary" href="/features">
                Features
              </a>
            </li>
            <li>
              <a className="hover:text-primary" href="/subscription">
                Pricing
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-foreground">Resources</div>
          <ul className="mt-3 space-y-2">
            <li>
              <a className="hover:text-primary" href="/explore/jobs">
                Jobs
              </a>
            </li>
            <li>
              <a className="hover:text-primary" href="/explore/companies">
                Companies
              </a>
            </li>
            <li>
              <a className="hover:text-primary" href="/guides">
                Guides
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-foreground">Company</div>
          <ul className="mt-3 space-y-2">
            <li>
              <a className="hover:text-primary" href="/about">
                About
              </a>
            </li>
            <li>
              <a className="hover:text-primary" href="/careers">
                Careers
              </a>
            </li>
            <li>
              <a className="hover:text-primary" href="/contact">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Workoo
      </div>
    </footer>
  );
}
