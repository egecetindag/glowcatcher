import { getPendingDeals } from "@/app/actions/editor";
import EditorDealCard from "@/components/editor/EditorDealCard";

export default async function EditorPage() {
  const deals = await getPendingDeals();

  return (
    <div className="flex flex-col gap-6">
      {deals && deals.length > 0 ? (
        <div className="flex flex-col gap-4">
          {deals.map((deal) => (
            <EditorDealCard key={deal.id} deal={deal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-4xl mb-3">✦</p>
          <p className="text-sm">No pending deals. All caught up!</p>
        </div>
      )}
    </div>
  );
}
