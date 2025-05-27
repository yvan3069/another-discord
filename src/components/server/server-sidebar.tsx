import { RedirectToSignIn } from "@clerk/nextjs";
import { Channel, ChannelType, MemberRole, Profile } from "@prisma/client";

import { redirect } from "next/navigation";
import ServerHeader from "./server-header";
import { ServerWithMembersWithProfiles } from "@/type";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import ServerSection from "./server-section";
import ServerChannel from "./server-channel";

// with member with profiles with channels
interface ServerWithDetails extends ServerWithMembersWithProfiles {
  channels: Channel[];
}

interface ServerSidebarProps {
  server: ServerWithDetails;
  profile: Profile;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-indigo-500" />,
};

async function ServerSidebar({ server, profile }: ServerSidebarProps) {
  // TODO 为什么在layout和sidebar都有一次fetch servers?
  console.time("ServerSidebar: Total Execution");

  // console.time("ServerSidebar: currentProfile");
  // const profile = await currentProfile();
  // console.timeEnd("ServerSidebar: currentProfile");

  if (!profile) {
    console.timeEnd("ServerSidebar: Total Execution");
    return <RedirectToSignIn redirectUrl="/sign-in" />;
  }

  if (!server) {
    console.timeEnd("ServerSidebar: Total Execution");
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
  const members = server?.members;

  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;
  const renderStart = performance.now();
  const result = (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className=" flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Audio Channels",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2 " />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Channels"
            />
          </div>
        )}
        {textChannels.map((channel) => (
          <ServerChannel
            key={channel.id}
            channel={channel}
            server={server}
            role={role}
          />
        ))}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Audio Channels"
            />
          </div>
        )}
        {audioChannels.map((channel) => (
          <ServerChannel
            key={channel.id}
            channel={channel}
            server={server}
            role={role}
          />
        ))}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Video Channels"
            />
          </div>
        )}
        {/*TODO: 当点卡每一个videoChannel/audioChannel时，默认为对应的type */}
        {videoChannels.map((channel) => (
          <ServerChannel
            key={channel.id}
            channel={channel}
            server={server}
            role={role}
          />
        ))}
        {!!members?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              channelType={ChannelType.TEXT}
              role={role}
              label="Members"
              server={server}
            />
          </div>
        )}

        {members.map((member) => (
          <div key={member.id}>members</div>
        ))}
      </ScrollArea>
    </div>
  );
  const renderEnd = performance.now();
  console.log(
    `ServerSidebar: Component Rendering took ${renderEnd - renderStart}ms`
  ); // 新增
  console.timeEnd("ServerSidebar: Total Execution");
  return result;
}

export default ServerSidebar;
