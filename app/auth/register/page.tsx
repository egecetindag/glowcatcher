import { signUp } from "@/app/actions/auth/signUp";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import SubmitButton from "@/components/auth/SubmitButton";

export default function RegisterPage() {
  return (
    <>
      <div className=" bg-[url('/water_bg.jpg')] bg-cover bg-center fixed w-full bottom-0 inset-0 opacity-50 -z-10"></div>
      <div className="mb-12 flex items-center justify-center py-12 px-10 md:mx-10 bg-white shadow-sm rounded-lg">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold text-on-surface mb-2">
              Join the Glow
            </h1>
            <p className="text-on-surface-variant text-sm">
              Create your account to start curating your deals.
            </p>
          </div>

          <form action={signUp} className="flex flex-col gap-5">
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
                placeholder="hello@glowcatcher.com"
                required
                autoComplete="off"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-widest text-on-surface"
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                minLength={6}
                autoComplete="off"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="confirm_password"
                className="text-xs font-semibold uppercase tracking-widest text-on-surface"
              >
                Confirm Password
              </label>
              <Input
                id="confirm_password"
                name="confirm_password"
                type="password"
                placeholder="••••••••"
                minLength={6}
                required
                autoComplete="off"
              />
            </div>

            <SubmitButton label="Create Account" />
          </form>

          <p className="text-sm text-on-surface-variant text-center mt-6">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-primary font-medium hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
