"use client";

import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import UserAvatar from "../user-avatar";

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}
const iconMap = {
  [MemberRole.ADMIN]: <ShieldCheck className="w-5 h-5 ml-2 text-indigo-500" />,
  [MemberRole.MODERATOR]: <ShieldCheck className="w-5 h-5  text-indigo-500" />,
  [MemberRole.GUEST]: null,
};

function ServerMember({ member, server }: ServerMemberProps) {
  const params = useParams();
  const router = useRouter();
  function onClick() {
    router.push(`/servers/${server.id}/conversations/${member.id}`);
  }
  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-2 mb-1 rounded-md flex items-center gap-2 w-full hover:bg-zinc-700/10 dark:bg-zinc-700/50 transition",
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <UserAvatar
        src={member.profile.imageUrl}
        className="h-5 w-5 md:h-8 md:w-8"
      />

      <p
        className={cn(
          "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.memberId === member.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {member.profile.name}
      </p>
      <div className="ml-auto">{iconMap[member.role]}</div>
    </button>
  );
}

export default ServerMember;
