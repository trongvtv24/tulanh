"use client";

import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContentLockedProps {
  isPending: boolean;
  joinLoading: boolean;
  onJoin: () => void;
}

/**
 * Hiển thị khi user chưa join class - content bị khóa
 */
export function ContentLocked({
  isPending,
  joinLoading,
  onJoin,
}: ContentLockedProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-muted/10 rounded-xl border border-dashed text-center">
      <Lock className="w-12 h-12 text-muted-foreground opacity-50 mb-4" />
      <h3 className="text-xl font-bold">Content Locked</h3>
      <p className="text-muted-foreground max-w-sm mt-2">
        You must join this class to view and participate in discussions.
      </p>
      <Button
        onClick={onJoin}
        disabled={joinLoading || isPending}
        className="mt-6"
      >
        {isPending ? "Waiting for Approval" : "Join Now"}
      </Button>
    </div>
  );
}
