import { getPendingDeals } from "@/app/actions/editor";
import EditorActions from "@/components/editor/EditorActions";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function EditorPage() {
  const deals = await getPendingDeals();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Editor panel</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review and approve submitted deals
        </p>
      </div>

      {deals && deals.length > 0 ? (
        <div className="flex flex-col gap-4">
          {deals.map((deal) => (
            <div key={deal.id}>
              <div className="border rounded-2xl p-4 flex flex-col gap-3 bg-card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="pending">Pending</Badge>
                      <span className="text-xs text-muted-foreground">
                        by {deal.profiles?.username ?? "unknown"}
                      </span>
                    </div>
                    <h2 className="font-medium text-sm">{deal.title}</h2>
                    <p className="text-xs text-muted-foreground">
                      {deal.store}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-lg font-semibold text-amber-500">
                      £{deal.price}
                    </p>
                    {deal.original_price && (
                      <p className="text-xs text-muted-foreground line-through">
                        £{deal.original_price}
                      </p>
                    )}
                  </div>
                </div>

                {deal.description && (
                  <p className="text-xs text-muted-foreground border-t pt-3">
                    {deal.description}
                  </p>
                )}

                {deal.image_url && (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={deal.image_url}
                      alt={deal.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground border-t pt-3">
                  {deal.category && (
                    <Badge variant="matte">{deal.category}</Badge>
                  )}
                  {deal.voucher_code && (
                    <span className="font-mono bg-muted px-2 py-0.5 rounded">
                      {deal.voucher_code}
                    </span>
                  )}
                  {deal.url && (
                    <Link
                      href={deal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:underline ml-auto"
                    >
                      View deal →
                    </Link>
                  )}
                </div>

                <EditorActions dealId={deal.id} />
              </div>
            </div>
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
