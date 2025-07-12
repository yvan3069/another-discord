import { Skeleton } from "../ui/skeleton";

function ServerSidebarDefault() {
  return (
    <div className="flex flex-col h-full w-full dark:bg-[#2B2D31] bg-[#F2F3F5] space-y-5 p-4">
      <Skeleton className="w-full h-8 rounded-xl bg-[#d9dadc]" />

      <Skeleton className="w-full h-8 rounded-xl bg-[#d9dadc]" />

      <div className="space-y-3 pt-2">
        <Skeleton className="w-full h-6 rounded-xl bg-[#d9dadc]" />
        <Skeleton className="w-full h-6 rounded-xl bg-[#d9dadc]" />
        <Skeleton className="w-full h-6 rounded-xl bg-[#d9dadc]" />
        <Skeleton className="w-full h-6 rounded-xl bg-[#d9dadc]" />
      </div>
    </div>
  );
}

export default ServerSidebarDefault;
