//estandarizar los enlaces

import Link from "next/link";

export function AuthFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 text-center">{children}</div>;
}

export function AuthLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-blue-600 hover:underline">
      {children}
    </Link>
  );
}