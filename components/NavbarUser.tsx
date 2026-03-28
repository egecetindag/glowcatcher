"use client";

import Link from "next/link";
import { signOut } from "@/app/actions/auth/signOut";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CurrentUser } from "@/app/actions/auth/getUser";

export default function NavbarUser({ user }: { user: CurrentUser }) {
  return (
    <div className="flex items-center gap-3">
      <Button variant="glow" size="sm" asChild>
        <Link href="/submit">Add a Deal</Link>
      </Button>

      {(user.role === "editor" || user.role === "admin") && (
        <Button variant="glow-outline" size="sm" asChild>
          <Link href="/editor">Editor</Link>
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-amber-200 hover:ring-amber-400 transition">
            <AvatarImage src={user.avatar_url ?? undefined} />
            <AvatarFallback className="bg-pink-100 text-pink-700 text-xs">
              {user.username?.slice(0, 2).toUpperCase() ?? "✦"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{user.username}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <i className="fi fi-rr-user text-sm leading-none" />
            <Link href="/profile">My profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <i className="fi fi-rr-tag text-sm leading-none" />
            <Link href="/profile/deals">My deals</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <form action={signOut}>
              <button className="w-full text-left text-red-500">
                <i className="fi fi-rr-sign-out-alt text-sm leading-none" />
                Sign out
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
