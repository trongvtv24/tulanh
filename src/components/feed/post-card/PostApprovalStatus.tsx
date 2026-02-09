import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { Check, Lock, ThumbsUp, X } from "lucide-react";

interface PostApprovalStatusProps {
  approvalVotes: number;
  isAdmin: boolean;
  hasVotedApprove: boolean;
  onVoteApprove: () => void;
  onAdminApprove: () => void;
  onAdminReject: () => void;
}

export function PostApprovalStatus({
  approvalVotes,
  isAdmin,
  hasVotedApprove,
  onVoteApprove,
  onAdminApprove,
  onAdminReject,
}: PostApprovalStatusProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-yellow-600 text-xs font-medium flex items-center gap-1">
          <Lock className="h-3 w-3" /> {t.admin.pendingApproval}
        </span>
        <span className="text-xs text-muted-foreground">
          • {approvalVotes} {t.admin.votes}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {isAdmin ? (
          <>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-green-600"
              onClick={onAdminApprove}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-red-600"
              onClick={onAdminReject}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          !hasVotedApprove && (
            <Button
              size="sm"
              variant="outline"
              className="h-6 text-xs gap-1"
              onClick={onVoteApprove}
            >
              <ThumbsUp className="h-3 w-3" /> {t.admin.voteOk}
            </Button>
          )
        )}
      </div>
    </div>
  );
}
