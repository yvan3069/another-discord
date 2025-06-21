import SocketIndicator from "@/components/sokcet-indicator";
import { Skeleton } from "@/components/ui/skeleton";

function ChatHeaderDefault() {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-x-neutral-100 dark:border-neutral-800 border-b-2">
      {/* <Circle className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" /> */}
      <Skeleton className="h-5 w-5 rounded-full" />
      {/* <p className="font-semibold text-md text-black dark:text-white">
        Loading....
      </p> */}
      <Skeleton className="h-4 w-[250px]" />
      <div className="ml-auto flex items-center">
        <SocketIndicator />
      </div>
    </div>
  );
}

export default ChatHeaderDefault;
