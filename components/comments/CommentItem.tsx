"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import CommentForm from "./CommentForm";
import { toggleReaction } from "@/app/actions/comments";
import { formatDistanceToNow } from "date-fns";
import type { CurrentUser } from "@/app/actions/auth/getUser";

const EMOJIS = ["👍", "👎", "😂", "😍", "🔥", "💅", "👀"];

type Reaction = {
  emoji: string;
  user_id: string;
};

type Comment = {
  id: string;
  content: string;
  created_at: string;
  profiles: { username: string; avatar_url?: string };
  comment_reactions: Reaction[];
  replies?: Comment[];
};

type Props = {
  comment: Comment;
  dealId: string;
  currentUser: CurrentUser | null;
  isReply?: boolean;
};

export default function CommentItem({
  comment,
  dealId,
  currentUser,
  isReply,
}: Props) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAllReplies, setShowAllReplies] = useState(false);

  const replies = comment.replies ?? [];
  const firstReply = replies[0];
  const remainingReplies = replies.slice(1);

  const reactionMap = comment.comment_reactions.reduce(
    (acc, r) => {
      if (!acc[r.emoji]) acc[r.emoji] = [];
      acc[r.emoji].push(r.user_id);
      return acc;
    },
    {} as Record<string, string[]>,
  );

  async function handleReaction(emoji: string) {
    await toggleReaction(comment.id, emoji, dealId);
    setShowEmojiPicker(false);
  }

  return (
    <div className={`flex gap-3 ${isReply ? "ml-10" : ""}`}>
      <Avatar className="w-8 h-8 shrink-0 mt-0.5">
        <AvatarImage src={comment.profiles?.avatar_url ?? undefined} />
        <AvatarFallback className="bg-pink-100 text-pink-700 text-xs">
          {comment.profiles?.username?.slice(0, 1).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-1.5 flex-1">
        {/* Bubble */}
        <div className="bg-surface-container-low rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-on-surface">
              {comment.profiles?.username}
            </span>
            <span className="text-xs text-on-surface-variant">
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>
          <p className="text-sm text-on-surface leading-relaxed">
            {comment.content}
          </p>
        </div>

        {/* Reactions + actions */}
        {/* Reactions + actions */}
        <div className="flex items-center gap-2 flex-wrap px-1">
          {Object.entries(reactionMap).map(([emoji, users]) => (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition border ${
                currentUser && users.includes(currentUser.id)
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-surface-container-low border-transparent hover:border-outline-variant/30"
              }`}
            >
              <span>{emoji}</span>
              <span className="text-on-surface-variant">{users.length}</span>
            </button>
          ))}

          {/* Emoji picker */}
          <div className="relative">
            <Button
              variant="matte"
              size="pill"
              onClick={() => setShowEmojiPicker((p) => !p)}
            >
              <span className="text-base leading-none">
                <i className="fi fi-rr-smile-plus"></i>
              </span>
            </Button>
            {showEmojiPicker && (
              <div className="absolute bottom-9 left-0 z-20 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/20 p-2 flex gap-1">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-low transition text-base"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {!isReply && currentUser && (
            <Button
              variant="matte"
              size="pill"
              onClick={() => setShowReplyForm((r) => !r)}
            >
              Reply
            </Button>
          )}
        </div>
        {/* Reply form */}
        {showReplyForm && (
          <div className="mt-1">
            <CommentForm
              dealId={dealId}
              parentId={comment.id}
              onCancel={() => setShowReplyForm(false)}
              placeholder={`Reply to ${comment.profiles?.username}...`}
            />
          </div>
        )}

        {/* Replies — ilki otomatik, geri kalanlar see more */}
        {!isReply && replies.length > 0 && (
          <div className="flex flex-col gap-3 mt-2">
            {/* İlk reply her zaman görünür */}
            <CommentItem
              key={firstReply.id}
              comment={firstReply}
              dealId={dealId}
              currentUser={currentUser}
              isReply
            />

            {/* Kalan reply'lar */}
            {remainingReplies.length > 0 && (
              <>
                {showAllReplies ? (
                  remainingReplies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      dealId={dealId}
                      currentUser={currentUser}
                      isReply
                    />
                  ))
                ) : (
                  <button
                    onClick={() => setShowAllReplies(true)}
                    className="text-xs text-primary hover:underline ml-10 text-left"
                  >
                    See {remainingReplies.length} more{" "}
                    {remainingReplies.length === 1 ? "reply" : "replies"}
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
