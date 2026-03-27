import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function VerifyPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <p className="text-4xl text-amber-500 mb-2">✦</p>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            We&apos;ve sent you a verification link. Click it to activate your
            GlowCatcher account.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive it? Check your spam folder.
          </p>
          <Button variant="glow" asChild>
            <Link href="/auth/login">Back to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
