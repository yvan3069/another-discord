import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import NavigationSidebar from "./navigation/navigationSidebar";
import ServerSidebar from "./server/server-sidebar";
import { Profile } from "@prisma/client";
import { Suspense } from "react";
import ServerSidebarDefault from "./loading/server-sidebar-default";

// with member with profiles with channels
// interface ServerWithDetails extends ServerWithMembersWithProfiles {
//   channels: Channel[];
// }

interface MobileToggleProps {
  serverId: string;
  profile: Profile;
}

function MobileToggle({ serverId, profile }: MobileToggleProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="">
          <Menu />
        </Button>
      </SheetTrigger>
      {/* <DialogTitle className="hidden">serverside bar</DialogTitle> */}
      <SheetContent side="left" className="p-0 flex gap-0">
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>
        <Suspense fallback={<ServerSidebarDefault />}>
          <ServerSidebar serverId={serverId} profile={profile} mode="mobile" />
        </Suspense>
      </SheetContent>
    </Sheet>
  );
}

export default MobileToggle;
