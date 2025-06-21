import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatHeaderDefault from "@/components/loading/chat-header-default";
import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ChatMessages from "./chat-messages";

interface ChatContentProps {
  serverId: string;
  channelId: string;
}

async function ChatContent({ serverId, channelId }: ChatContentProps) {
  const profile = await currentProfile();
  //   const { serverId, channelId } = params;
  if (!profile) {
    return <RedirectToSignIn />;
  }
  console.time("ChannelId Page:db.channle.findUnique and db.member.findFirst");
  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });
  const member = await db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profile.id,
    },
  });
  console.timeEnd(
    "ChannelId Page:db.channle.findUnique and db.member.findFirst"
  );
  if (!channel || !member) {
    redirect("/");
  }
  return (
    <>
      <Suspense fallback={<ChatHeaderDefault />}>
        <ChatHeader
          serverId={serverId}
          name={channel.name}
          type="channel"
          profile={profile}
        />
      </Suspense>
      <ChatMessages
        member={member}
        name={channel.name}
        chatId={channelId}
        type="channel"
        socketUrl="/api/socket/messages"
        apiUrl="/api/messages"
        socketQuery={{
          channelId: channelId,
          serverId: serverId,
        }}
        paramKey="channelId"
        paramValue={channelId}
      />
      <ChatInput
        name={channel.name}
        type="channel"
        apiUrl="/api/socket/messages"
        query={{
          channelId: channelId,
          serverId: serverId,
        }}
      />
    </>
  );
}

export default ChatContent;
