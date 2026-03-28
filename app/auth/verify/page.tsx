import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VerifyPage() {
  return (
    <>
      <div className=" bg-[url('/water_bg.jpg')] bg-cover bg-center fixed w-full bottom-0 inset-0 opacity-50 -z-10"></div>
      <div className="mb-12 flex items-center justify-center py-12 px-10 md:mx-10 z-10 bg-white shadow-sm rounded-lg">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-8 text-center">
            <p className="text-4xl text-amber-500 mb-4">✦</p>
            <h1 className="font-serif text-4xl font-bold text-on-surface mb-2">
              Check your email
            </h1>
            <p className="text-on-surface-variant text-sm">
              We&apos;ve sent you a verification link. Click it to activate your
              GlowCatcher account.
            </p>
          </div>

          <p className="text-sm text-muted-foreground text-center mb-5">
            Didn&apos;t receive it? Check your spam folder.
          </p>

          <Button
            variant="glow"
            size="lg"
            className="w-full uppercase tracking-widest mt-2"
            asChild
          >
            <Link href="/auth/login">Back to Sign In</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
