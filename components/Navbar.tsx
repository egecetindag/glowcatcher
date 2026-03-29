import Link from "next/link";
import { getUser } from "@/app/actions/auth/getUser";
import { Button } from "@/components/ui/button";
import NavbarUser from "./NavbarUser";
import SearchBar from "./SearchBar";

export default async function Navbar() {
  const user = await getUser();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-[20px] bg-white shadow-sm ">
      <div className="max-w-200 mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold text-primary tracking-tight whitespace-nowrap"
        >
          ✦ GlowCatcher
        </Link>
        <SearchBar />
        {user ? (
          <NavbarUser user={user} />
        ) : (
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="whitespace-nowrap"
            >
              <Link href="/auth/register">Sign up</Link>
            </Button>
            <Button
              variant="glow"
              size="sm"
              asChild
              className="whitespace-nowrap"
            >
              <Link href="/auth/login">Sign in</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
