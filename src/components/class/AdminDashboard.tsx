"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { UI_Post } from "@/hooks/usePosts";

// Types
export interface PendingMember {
  id: string;
  user_id: string;
  community_id: string;
  role: string;
  status: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
    level: number;
  } | null;
}

// Props interfaces
interface MemberRequestsCardProps {
  members: PendingMember[];
  onApprove: (memberId: string) => void;
  onReject: (memberId: string) => void;
  onBlock: (memberId: string, userId: string) => void;
}

interface PendingPostsCardProps {
  posts: UI_Post[];
  onApprove: (postId: string) => void;
  onReject: (postId: string) => void;
}

interface AdminDashboardProps {
  pendingMembers: PendingMember[];
  pendingPosts: UI_Post[];
  onApproveMember: (memberId: string) => void;
  onRejectMember: (memberId: string) => void;
  onBlockMember: (memberId: string, userId: string) => void;
  onApprovePost: (postId: string) => void;
  onRejectPost: (postId: string) => void;
}

/**
 * Card hiển thị danh sách member đang chờ duyệt
 */
function MemberRequestsCard({
  members,
  onApprove,
  onReject,
  onBlock,
}: MemberRequestsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          Member Requests
          <Badge variant="secondary">{members.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending requests.</p>
        ) : (
          members.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={m.profiles?.avatar_url ?? undefined} />
                  <AvatarFallback>{m.profiles?.full_name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm">
                    {m.profiles?.full_name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Level {m.profiles?.level}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  className="h-7 text-xs bg-green-600 hover:bg-green-700"
                  onClick={() => onApprove(m.id)}
                >
                  <CheckCircle className="h-3 w-3 mr-1" /> Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => onReject(m.id)}
                >
                  <XCircle className="h-3 w-3 mr-1" /> Reject
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-7 text-xs"
                  onClick={() => onBlock(m.id, m.user_id)}
                >
                  Block
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Card hiển thị danh sách posts đang chờ duyệt
 */
function PendingPostsCard({
  posts,
  onApprove,
  onReject,
}: PendingPostsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          Pending Posts
          <Badge variant="secondary">{posts.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending posts.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="p-3 bg-secondary/20 rounded-lg space-y-3"
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={post.user.avatar} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                {post.user.name}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {post.content}
              </p>
              {post.image_url && (
                <div className="text-xs text-blue-500">[Contains Image]</div>
              )}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="h-7 text-xs w-full bg-green-600 hover:bg-green-700"
                  onClick={() => onApprove(post.id)}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-7 text-xs w-full"
                  onClick={() => onReject(post.id)}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Admin Dashboard component - Hiển thị trong tab Admin
 */
export function AdminDashboard({
  pendingMembers,
  pendingPosts,
  onApproveMember,
  onRejectMember,
  onBlockMember,
  onApprovePost,
  onRejectPost,
}: AdminDashboardProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <MemberRequestsCard
        members={pendingMembers}
        onApprove={onApproveMember}
        onReject={onRejectMember}
        onBlock={onBlockMember}
      />
      <PendingPostsCard
        posts={pendingPosts}
        onApprove={onApprovePost}
        onReject={onRejectPost}
      />
    </div>
  );
}
