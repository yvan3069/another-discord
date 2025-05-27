"use client";

import { MemberRole } from "@prisma/client";
import { ServerWithMembersWithProfiles } from "@/type";
import { DropdownMenu, DropdownMenuSeparator } from "../ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  User,
  UserPlus,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { onOpen, serializeServer } from "@/store/features/createModalSlice";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}
function ServerHeader({ server, role }: ServerHeaderProps) {
  const isAdmin = role === MemberRole.ADMIN;
  const isMonderator = isAdmin || role === MemberRole.MODERATOR;
  const dispatch = useDispatch();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          {server.name}
          <ChevronDown className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
        {isMonderator && (
          <DropdownMenuItem
            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
            onClick={() =>
              dispatch(
                onOpen({
                  openType: "invite",
                  data: { server: serializeServer(server) },
                })
              )
            }
          >
            Invite people
            <UserPlus className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer"
            onClick={() => {
              dispatch(
                onOpen({
                  openType: "editServer",
                  data: { server: serializeServer(server) },
                })
              );
            }}
          >
            settings
            <Settings className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer"
            onClick={() => {
              dispatch(
                onOpen({
                  openType: "members",
                  data: { server: serializeServer(server) },
                })
              );
            }}
          >
            Manage Members
            <User className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isMonderator && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer"
            onClick={() => {
              dispatch(
                onOpen({
                  openType: "createChannel",
                })
              );
            }}
          >
            Create Channels
            <PlusCircle className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {/* TODO: separator is ligth and not very visiable */}
        {isMonderator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
            onClick={() => {
              dispatch(
                onOpen({
                  openType: "deleteServer",
                  data: { server: serializeServer(server) },
                })
              );
            }}
          >
            Delete Server
            <Trash className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
            onClick={() => {
              dispatch(
                onOpen({
                  openType: "leaveServer",
                  data: { server: serializeServer(server) },
                })
              );
            }}
          >
            Leave Server
            <LogOut className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ServerHeader;
