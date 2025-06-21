import { Skeleton } from "@/components/ui/skeleton";

export function ChannelPageDefalut() {
  return (
    <div className="p-4 space-y-4">
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="h-96 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}
