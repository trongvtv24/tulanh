"use client";

import { Users, ShieldCheck, Clock, UserPlus, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Community {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  cover_image?: string;
  required_level: number;
}

interface ClassHeaderProps {
  community: Community;
  isMember: boolean;
  isPending: boolean;
  joinLoading: boolean;
  onJoin: () => void;
}

/**
 * Header component cho Class page với banner và thông tin cơ bản
 */
export function ClassHeader({
  community,
  isMember,
  isPending,
  joinLoading,
  onJoin,
}: ClassHeaderProps) {
  return (
    <div className="relative rounded-xl overflow-hidden bg-card border border-border/50 shadow-sm text-card-foreground">
      <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90"></div>
      <div className="absolute -bottom-12 left-8 flex items-end gap-4">
        <div className="w-24 h-24 rounded-2xl bg-card p-2 shadow-xl border border-border">
          <div className="w-full h-full bg-primary/10 rounded-xl flex items-center justify-center text-4xl">
            {community.icon === "Youtube" ? "📺" : "📚"}
          </div>
        </div>
      </div>
      <div className="pt-16 pb-6 px-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {community.name}
          </h1>
          <p className="text-muted-foreground mt-1 max-w-xl">
            {community.description}
          </p>
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Private Group
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {community.required_level > 0
                ? `Level ${community.required_level}+ Required`
                : "Open to All"}
            </span>
          </div>
        </div>
        <div>
          <MembershipButton
            isMember={isMember}
            isPending={isPending}
            joinLoading={joinLoading}
            onJoin={onJoin}
          />
        </div>
      </div>
    </div>
  );
}

interface MembershipButtonProps {
  isMember: boolean;
  isPending: boolean;
  joinLoading: boolean;
  onJoin: () => void;
}

/**
 * Button hiển thị trạng thái membership
 */
function MembershipButton({
  isMember,
  isPending,
  joinLoading,
  onJoin,
}: MembershipButtonProps) {
  if (isMember) {
    return (
      <Button variant="outline" className="gap-2">
        <CheckCircle className="w-4 h-4 text-green-500" /> Member
      </Button>
    );
  }

  if (isPending) {
    return (
      <Button disabled variant="secondary" className="gap-2">
        <Clock className="w-4 h-4" /> Request Pending
      </Button>
    );
  }

  return (
    <Button onClick={onJoin} disabled={joinLoading} className="gap-2">
      <UserPlus className="w-4 h-4" /> Join Class
    </Button>
  );
}
