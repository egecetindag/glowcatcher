import { setupProfile } from "@/app/actions/auth/setupProfile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ProfileSetupPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <p className="text-2xl text-amber-500 mb-2">✦</p>
          <CardTitle>Set up your profile</CardTitle>
          <CardDescription>
            Tell the community a bit about yourself
          </CardDescription>
        </CardHeader>

        <form action={setupProfile}>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="w-20 h-20 rounded-full bg-pink-100 border-2 border-dashed border-pink-300 flex items-center justify-center text-pink-400 text-2xl">
                ✦
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <Label htmlFor="avatar">Profile photo</Label>
                <Input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  className="cursor-pointer"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="glowgirl"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Beauty lover, bargain hunter..."
                rows={3}
                className="resize-none"
              />
            </div>
          </CardContent>

          <div className="px-6 pb-6 flex flex-col gap-3">
            <Button variant="glow" className="w-full" type="submit">
              Let's glow
            </Button>
            <Button
              variant="ghost"
              className="w-full text-muted-foreground text-xs"
              type="submit"
              name="skip"
              value="true"
            >
              Skip for now
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
