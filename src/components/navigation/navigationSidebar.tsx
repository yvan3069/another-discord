import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import NavigationAction from "./navigationAction";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavigationItem from "./navigationItem";
import { ModeToggle } from "../mode-toggle";
import { UserButton } from "@clerk/nextjs";

async function NavigationSidebar() {
  console.time("NavigationSidebar: currentProfile");
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }
  console.timeEnd("NavigationSidebar: currentProfile");

  console.time("NavigationSidebar: db.server.findMany");
  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  console.timeEnd("NavigationSidebar: db.server.findMany");

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full bg-[#E3E5E8] dark:bg-[#1E1F22] py-3">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            {/*TODO 初次点击可能会感觉到延迟, 可以用骨架图 */}
            <NavigationItem
              id={server.id}
              imageUrl={server.imageUrl}
              name={server.name}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px]",
            },
          }}
        />
      </div>
    </div>
  );
}

export default NavigationSidebar;
