import { RedirectToSignIn } from "@clerk/nextjs";
import { ChannelType, MemberRole, Profile } from "@prisma/client";

import { redirect } from "next/navigation";
import ServerHeader from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import ServerSection from "./server-section";
import ServerChannel from "./server-channel";
import ServerMember from "./server-member";
import db from "@/lib/db";

// // with member with profiles with channels
// interface ServerWithDetails extends ServerWithMembersWithProfiles {
//   channels: Channel[];
// }

interface ServerSidebarProps {
  //server: ServerWithDetails;
  serverId: string;
  profile: Profile;
  mode?: "mobile" | "desktop";
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

async function ServerSidebar({ serverId, profile, mode }: ServerSidebarProps) {
  console.time("ServerSidebar: Total Execution");

  console.time("ServerIdLayout: db.server.findUnique"); // 开始计时: 数据库查询

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
  console.timeEnd("ServerIdLayout: db.server.findUnique"); // 结束计时: 数据库查询

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

  const isMember = server.members.some(
    (member) => member.profileId === profile.id
  );
  if (!isMember) {
    // 如果不希望非成员看到任何内容，或者没有权限访问这个 serverId，则重定向
    // 这个逻辑取决于你的业务需求。如果 ServerIdLayout 应该只对成员可见，
    // 那么这个检查是必要的。
    console.warn(
      `User ${profile.id} is not a member of server ${server.id}. Redirecting.`
    );
    console.timeEnd("ServerIdLayout: Total Execution");
    return redirect("/"); // 或者抛出一个错误，或者显示一个“无权限”页面
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
      <ServerHeader server={server} role={role} mode={mode} />
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
              channelType={ChannelType.AUDIO}
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
              channelType={ChannelType.VIDEO}
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
              role={role}
              label="Members"
              server={server}
            />
          </div>
        )}

        {members.map((member) => (
          <ServerMember key={member.id} member={member} server={server} />
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
