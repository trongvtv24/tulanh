import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function PostSkeleton() {
  return (
    <Card className="overflow-hidden border-border/60 mb-6">
      <CardHeader className="flex flex-row items-center gap-3 p-4 pb-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-3 w-[80px]" />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-4">
        {/* Title simulated */}
        <Skeleton className="h-6 w-3/4" />
        {/* Content paragraphs */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[95%]" />
        </div>
        {/* Image placeholder */}
        <Skeleton className="h-[200px] w-full rounded-md mt-4" />
      </CardContent>
      <CardFooter className="p-0">
        <div className="flex w-full justify-between border-t bg-muted/20 p-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </CardFooter>
    </Card>
  )
}
