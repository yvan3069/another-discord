"use client";

import { ServerWithMembersWithProfiles } from "@/type";
import { ChannelType, MemberRole } from "@prisma/client";
import ActionTooltip from "../actionTooltip";
import { Plus, Settings } from "lucide-react";
import { useAppDispatch } from "@/lib/hooks";
import { onOpen, serializeServer } from "@/store/features/createModalSlice";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType: ChannelType;
  server?: ServerWithMembersWithProfiles;
}

function ServerSection({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) {
  const dispatch = useAppDispatch();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === "channels" && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            onClick={() => dispatch(onOpen({ openType: "createChannel" }))}
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip label="Manage Members" side="top">
          <button
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            onClick={() => dispatch(onOpen({ openType: "members" }))}
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
}

export default ServerSection;
