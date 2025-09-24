export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-4 text-sm text-muted-foreground">
        <div>
          <div className="font-semibold text-foreground text-lg">ProHire</div>
          <p className="mt-2 max-w-sm">Modern job board to connect talents and companies.</p>
        </div>
        <div>
          <div className="font-semibold text-foreground">Product</div>
          <ul className="mt-3 space-y-2">
            <li><a className="hover:text-primary" href="#">Features</a></li>
            <li><a className="hover:text-primary" href="#">Pricing</a></li>
            <li><a className="hover:text-primary" href="#">AI Matching</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-foreground">Resources</div>
          <ul className="mt-3 space-y-2">
            <li><a className="hover:text-primary" href="#">Jobs</a></li>
            <li><a className="hover:text-primary" href="#">Companies</a></li>
            <li><a className="hover:text-primary" href="#">Guides</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-foreground">Company</div>
          <ul className="mt-3 space-y-2">
            <li><a className="hover:text-primary" href="#">About</a></li>
            <li><a className="hover:text-primary" href="#">Careers</a></li>
            <li><a className="hover:text-primary" href="#">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-5 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} ProHire</div>
    </footer>
  );
}
