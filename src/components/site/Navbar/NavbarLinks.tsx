import Link from "next/link";

interface Props {
  links: { href: string; label: string }[];
  pathname: string | null;
}

export default function NavbarLinks({ links, pathname }: Props) {
  return (
    <>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`text-sm font-medium transition-colors ${
            pathname?.startsWith(l.href)
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {l.label}
        </Link>
      ))}
    </>
  );
}