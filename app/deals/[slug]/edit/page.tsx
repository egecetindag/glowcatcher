import { getUser } from "@/app/actions/auth/getUser";
import { redirect, notFound } from "next/navigation";
import EditDealCard from "@/components/editor/EditDealCard";
import { getDeal } from "@/app/actions/deals";

export default async function EditDealPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await getUser();
  if (!user || !["editor", "admin"].includes(user.role ?? "")) {
    redirect("/");
  }
  const { slug } = await params;

  const deal = await getDeal(slug);
  if (!deal) notFound();

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-on-surface">
          Edit deal
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">{deal.title}</p>
      </div>
      <EditDealCard deal={deal} />
    </div>
  );
}
