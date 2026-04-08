"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/editor", label: "Deals", icon: "fi-rr-tag" },
  { href: "/editor/sections", label: "Sections", icon: "fi-rr-layout-fluid" },
];

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-on-surface">
          Editor panel
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Manage deals and content
        </p>
      </div>

      <div className="flex gap-1 bg-surface-container-low rounded-full p-1 w-fit">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition ${
              pathname === item.href
                ? "bg-surface-container-lowest text-on-surface shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <i className={`fi ${item.icon} text-sm leading-none`} />
            {item.label}
          </Link>
        ))}
      </div>

      {children}
    </div>
  );
}
