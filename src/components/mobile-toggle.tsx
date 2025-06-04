import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import NavigationSidebar from "./navigation/navigationSidebar";
import ServerSidebar from "./server/server-sidebar";
import { ServerWithMembersWithProfiles } from "@/type";
import { Profile, Channel } from "@prisma/client";

// with member with profiles with channels
interface ServerWithDetails extends ServerWithMembersWithProfiles {
  channels: Channel[];
}

interface MobileToggleProps {
  server: ServerWithDetails;
  profile: Profile;
}

function MobileToggle({ server, profile }: MobileToggleProps) {
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
          {/*TODO 解决navigation下拉框和sheetdialog取消键重合的问题 */}
          <NavigationSidebar />
        </div>
        <ServerSidebar server={server} profile={profile} />
      </SheetContent>
    </Sheet>
  );
}

export default MobileToggle;
