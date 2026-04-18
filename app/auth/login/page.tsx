"use client";

import { useActionState } from "react";
import { signIn } from "@/app/actions/auth/signIn";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import SubmitButton from "@/components/auth/SubmitButton";

export default function LoginPage() {
  const [state, action] = useActionState(signIn, null);

  return (
    <>
      <div className="bg-[url('/water_bg.jpg')] bg-cover bg-center fixed w-full bottom-0 inset-0 opacity-50 -z-10"></div>
      <div className="mb-12 flex items-center justify-center py-12 px-10 md:mx-10 z-10 bg-white shadow-sm rounded-lg">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold text-on-surface mb-2">
              Welcome Back
            </h1>
            <p className="text-on-surface-variant text-sm">
              Sign in to access your curated dashboard.
            </p>
          </div>

          <form action={action} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-widest text-on-surface"
              >
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-widest text-on-surface"
                >
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            {state?.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}

            <SubmitButton label="Sign In" />
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-outline-variant" />
            <span className="text-xs text-on-surface-variant">Or continue with</span>
            <div className="flex-1 h-px bg-outline-variant" />
          </div>

          <p className="text-sm text-on-surface-variant text-center mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-primary font-medium hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
