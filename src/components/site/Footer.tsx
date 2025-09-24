export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-8 grid gap-4 md:grid-cols-3 text-sm text-gray-600">
        <div>
          <div className="font-semibold text-gray-900">ProHire</div>
          <p className="mt-2">Modern job board to connect talents and companies.</p>
        </div>
        <div>
          <div className="font-semibold text-gray-900">Resources</div>
          <ul className="mt-2 space-y-1">
            <li><a className="hover:text-blue-600" href="#">Jobs</a></li>
            <li><a className="hover:text-blue-600" href="#">Companies</a></li>
            <li><a className="hover:text-blue-600" href="#">Pricing</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-gray-900">Follow</div>
          <ul className="mt-2 space-y-1">
            <li><a className="hover:text-blue-600" href="#">LinkedIn</a></li>
            <li><a className="hover:text-blue-600" href="#">Twitter</a></li>
            <li><a className="hover:text-blue-600" href="#">Facebook</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-gray-500">© {new Date().getFullYear()} ProHire</div>
    </footer>
  );
}
