import { Hash } from "lucide-react";
import MobileToggle from "@/components/mobile-toggle";
import { Profile } from "@prisma/client";
import db from "@/lib/db";
import UserAvatar from "../user-avatar";
import SocketIndicator from "@/components/sokcet-indicator";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  profile: Profile;
  imageUrl?: string;
}

async function ChatHeader({
  serverId,
  name,
  type,
  imageUrl,
  profile,
}: ChatHeaderProps) {
  console.time("ChatHeader: db.server.findUnique");
  // TODO: 减少不必要的请求。
  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          name: "asc", // Replace 'name' with a valid field in the 'channels' table
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });
  console.timeEnd("ChatHeader: db.server.findUnique");
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-x-neutral-100 dark:border-neutral-800 border-b-2">
      <div className="md:hidden">
        {server && <MobileToggle server={server} profile={profile} />}
      </div>
      {type === "channel" && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      {type === "conversation" && (
        <UserAvatar src={imageUrl} className="mr-3" />
      )}
      <p className="font-semibold text-md text-black dark:text-white">{name}</p>
      <div className="ml-auto flex items-center">
        <SocketIndicator />
      </div>
    </div>
  );
}

export default ChatHeader;
