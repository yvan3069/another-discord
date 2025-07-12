import NavigationAction from "../navigation/navigationAction";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

function NavigationSidebarDefault() {
  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full bg-[#E3E5E8] dark:bg-[#1E1F22] py-3">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        <div className="group relative flex items-center">
          <div className="relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden">
            <Skeleton className="w-full h-full" />
          </div>
        </div>
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <div>
          <Skeleton />
        </div>
        <div>
          <Skeleton />
        </div>
      </div>
    </div>
  );
}

export default NavigationSidebarDefault;
