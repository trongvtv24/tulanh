import { Feed } from "@/components/feed/Feed";
import { SidebarLeft } from "@/components/layout/SidebarLeft";
import { SidebarRight } from "@/components/layout/SidebarRight";

export default async function CommunityPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-card/50 p-6 rounded-lg border border-border/50">
        <h1 className="text-2xl font-bold capitalize mb-2">
          {params.slug.replace("-", " ")} Community
        </h1>
        <p className="text-muted-foreground">
          Welcome to the {params.slug} community feed.
        </p>
      </div>
      <Feed communityId={params.slug} />
    </div>
  );
}
