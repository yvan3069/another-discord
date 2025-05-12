interface ServerSidebarProps {
  serverId: string;
}

import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { ChannelType } from "@prisma/client";

import { redirect } from "next/navigation";
import ServerHeader from "./server-header";

async function ServerSidebar({ serverId }: ServerSidebarProps) {
  // TODO 为什么在layout和sidebar都有一次fetch servers?
  const profile = await currentProfile();
  if (!profile) return <RedirectToSignIn redirectUrl="/sign-in" />;

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
  if (!server) {
    return redirect("/");
  }

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
    </div>
  );
}

export default ServerSidebar;
