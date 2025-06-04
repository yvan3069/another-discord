"use client";

import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import ActionTooltip from "../actionTooltip";
import { useAppDispatch } from "@/lib/hooks";
import { onOpen } from "@/store/features/createModalSlice";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}
type onActionType = "editChannel" | "deleteChannel";

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

function ServerChannel({ channel, server, role }: ServerChannelProps) {
  const Icon = iconMap[channel.type];
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  function onClick() {
    router.push(`/servers/${params?.serverId}/channels/${channel.id}`);
  }
  function onAction(e: React.MouseEvent, type: onActionType) {
    e.stopPropagation();
    if (type === "deleteChannel") {
      dispatch(onOpen({ openType: "deleteChannel", channel: channel }));
      return;
    }
    if (type === "editChannel") {
      dispatch(onOpen({ openType: "editChannel", channel: channel }));
      return;
    }
  }
  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-2",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <Icon className="flex-shrink-0 w-4 h-4 text-zinc-500 dark:text-zinc-400 " />
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition:",
          params?.channelId === channel.id &&
            "text-primary dark:text-zinc-200 dark:grouo-hover:text-white"
        )}
      >
        {channel.name}
      </p>
      <div className="ml-auto flex gap-x-2">
        {channel.name !== "general" && role !== MemberRole.GUEST && (
          <>
            <ActionTooltip label="Edit">
              <Edit
                className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                onClick={(e) => onAction(e, "editChannel")}
              />
            </ActionTooltip>
            <ActionTooltip label="Delete">
              <Trash
                className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                onClick={(e) => onAction(e, "deleteChannel")}
              />
            </ActionTooltip>
          </>
        )}
      </div>

      {channel.name === "general" && (
        <Lock className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-400 dark:hover:text-zinc-300" />
      )}
    </button>
  );
}

export default ServerChannel;
