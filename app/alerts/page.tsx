import {
  getUserAlerts,
  createAlert,
  deleteAlert,
} from "@/app/actions/alerts/createAlert";
import { getUser } from "@/app/actions/auth/getUser";
import { redirect } from "next/navigation";
import AlertsClient from "@/components/alerts/AlertsClient";

export default async function AlertsPage() {
  const user = await getUser();
  if (!user) redirect("/auth/login");

  const alerts = await getUserAlerts();

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-on-surface">
          Deal alerts
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Get notified when a deal matching your keywords goes live
        </p>
      </div>

      <AlertsClient alerts={alerts} />
    </div>
  );
}
