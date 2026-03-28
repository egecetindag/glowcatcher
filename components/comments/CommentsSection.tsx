import { CurrentUser } from "@/app/actions/auth/getUser";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

type Comment = {
  id: string;
  content: string;
  created_at: string;
  parent_id: string | null;
  profiles: { username: string; avatar_url?: string };
  comment_reactions: { emoji: string; user_id: string }[];
  replies?: Comment[];
};

type Props = {
  dealId: string;
  comments: Comment[];
  currentUser: CurrentUser | null;
};

export default function CommentSection({
  dealId,
  comments,
  currentUser,
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-serif text-xl font-semibold text-on-surface">
        Discussion ({comments.length})
      </h2>

      {currentUser ? (
        <CommentForm dealId={dealId} />
      ) : (
        <div className="bg-surface-container-low rounded-xl p-4 text-center">
          <p className="text-sm text-on-surface-variant">
            <a
              href="/auth/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </a>{" "}
            to join the discussion
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              dealId={dealId}
              currentUser={currentUser}
            />
          ))
        ) : (
          <p className="text-sm text-on-surface-variant text-center py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </div>
    </div>
  );
}
