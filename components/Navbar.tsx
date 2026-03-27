import Link from "next/link";
import { getUser } from "@/app/actions/auth/getUser";
import { Button } from "@/components/ui/button";
import NavbarUser from "./NavbarUser";

export default async function Navbar() {
  const user = await getUser();

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-[20px]">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold text-primary tracking-tight">
          ✦ GlowCatcher
        </Link>

        {user ? (
          <NavbarUser user={user} />
        ) : (
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/register">Sign up</Link>
            </Button>
            <Button variant="glow" size="sm" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
