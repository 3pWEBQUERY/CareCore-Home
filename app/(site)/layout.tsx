import SiteFooter from "@/app/components/site-footer";
import SiteHeader from "@/app/components/site-header";
import { getCurrentUser } from "@/lib/auth";

export default async function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();
  const account = user ? { name: user.name, href: user.role === "admin" ? "/admin" : "/konto" } : null;
  return (
    <>
      <a className="skip-link" href="#inhalt">
        Zum Inhalt springen
      </a>
      <SiteHeader account={account} />
      <main id="inhalt">{children}</main>
      <SiteFooter />
    </>
  );
}
