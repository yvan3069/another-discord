"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppSelector } from "@/lib/hooks";
import {
  onClose,
  onOpen,
  selectModalData,
  selectModalIsOpen,
  selectModalOpenType,
} from "@/store/features/createModalSlice";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import axios from "axios";
import { ScrollArea } from "../ui/scroll-area";
import UserAvatar from "../user-avatar";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MemberRole } from "@prisma/client";
import qs from "query-string";
import { useRouter } from "next/navigation";

const roleMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldCheck className="h-4 w-4 ml-2 text-rose-500" />,
};

function MembersModal() {
  const [isMounted, setIsMounted] = useState(false);
  const [loadingId, setLoadingId] = useState("");
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const data = useAppSelector(selectModalData);
  const server = data?.server;

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(onClose());
  };

  const openType = useAppSelector(selectModalOpenType);
  const open = useAppSelector(selectModalIsOpen);
  const isOpen = openType === "members" && open;

  async function onRoleChange(memberId: string, role: MemberRole) {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });
      const response = await axios.patch(url, { role });

      // TODO: the data might not be fresh. you use refresh to reload the page to get the data, but what if ohters join in?
      router.refresh();
      const data = response.data;

      dispatch(onOpen({ openType: "members", data: data }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId("");
    }
  }
  async function onKick(memberId: string) {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });

      const response = await axios.delete(url);

      router.refresh();
      const data = response.data;

      dispatch(onOpen({ openType: "members", data: data }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId("");
    }
  }

  if (!isMounted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-500 mt-2">
            {server && "members" in server && Array.isArray(server.members)
              ? `${server.members.length} Members`
              : null}
          </DialogDescription>
          <ScrollArea className="mt-8 max-h[420px] pr-6 ">
            {server && "members" in server && Array.isArray(server.members)
              ? server.members.map((member) => (
                  <div
                    className="flex items-center gap-x-2 mb-6"
                    key={member.id}
                  >
                    <UserAvatar src={member.profile.imageUrl} />
                    <div className="flex flex-col gap-y-1">
                      <div className="text-xs font-semibold flex items-center gap-x-1">
                        {member.profile.name}
                        {roleMap[member.role]}
                      </div>
                      <p className="text-xs text-zinc-500">
                        {member.profile.email}
                      </p>
                    </div>
                    {server.profileId !== member.profileId &&
                      loadingId !== member.id && (
                        <div className="ml-auto">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <MoreVertical className="h-4 w-4 text-zinc-500" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="left">
                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger className="flex items-center">
                                  <ShieldQuestion className="h-4 w-4 mr-2" />
                                  <span>Role</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                  <DropdownMenuSubContent>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        onRoleChange(member.id, "GUEST")
                                      }
                                    >
                                      <Shield className="h-4 w-4 mr-2" />
                                      Guest
                                      {member.role === "GUEST" && (
                                        <Check className="w-4 h-4 ml-auto" />
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        onRoleChange(member.id, "MODERATOR")
                                      }
                                    >
                                      <Shield className="h-4 w-4 mr-2" />
                                      Moderator
                                      {member.role === "MODERATOR" && (
                                        <Check className="w-4 h-4 ml-auto" />
                                      )}
                                    </DropdownMenuItem>
                                  </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                              </DropdownMenuSub>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => onKick(member.id)}
                              >
                                <Gavel className="w-4 h-4 mr-2" />
                                kick
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    {loadingId === member.id && (
                      <Loader2 className="animate-spin text-zinc-500 ml-auto h-4 w-4" />
                    )}
                  </div>
                ))
              : null}
          </ScrollArea>
        </DialogHeader>
        <div className="p-6"></div>
      </DialogContent>
    </Dialog>
  );
}

export default MembersModal;
