import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatHeaderDefault from "@/components/loading/chat-header-default";
import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ChatMessages from "./chat-messages";
import { Member, Profile } from "@prisma/client";

type MemberWithProfiles = Member & {
  profile: Profile;
};

type ChatContentProps =
  | {
      type: "channel";
      serverId: string;
      channelId: string;
    }
  | {
      //for conversation part:
      type: "conversation";
      serverId: string;
      conversationId: string;
      otherMember: MemberWithProfiles;
    };

async function ChatContent(props: ChatContentProps) {
  const profile = await currentProfile();
  //   const { serverId, channelId } = params;
  if (!profile) {
    return <RedirectToSignIn />;
  }

  if (props.type === "channel") {
    const { channelId, serverId } = props;
    console.time(
      "ChannelId Page:db.channle.findUnique and db.member.findFirst"
    );
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
            type={props.type}
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

  if (props.type === "conversation") {
    const { serverId, conversationId, otherMember } = props;
    console.time(
      "ChannelId Page:db.channle.findUnique and db.member.findFirst --conversationBranch"
    );
    const member = await db.member.findFirst({
      where: {
        serverId: serverId,
        profileId: profile.id,
      },
    });
    console.timeEnd(
      "ChannelId Page:db.channle.findUnique and db.member.findFirst --conversationBranch"
    );
    if (!member) {
      redirect("/");
    }
    return (
      <>
        <Suspense fallback={<ChatHeaderDefault />}>
          <ChatHeader
            serverId={serverId}
            name={otherMember.profile.name}
            type={props.type}
            profile={profile}
            imageUrl={otherMember.profile.imageUrl}
          />
        </Suspense>
        {/*TODO: change the url where message send to. */}
        {/*TODO: 检查所有directMessage 的console.log 和传参 */}
        <ChatMessages
          member={member}
          name={otherMember.profile.name}
          chatId={conversationId}
          type={props.type}
          socketUrl="/api/socket/directMessages"
          apiUrl="/api/directMessages"
          socketQuery={{
            conversationId: conversationId,
            serverId: serverId,
          }}
          paramKey="conversationId"
          paramValue={conversationId}
        />
        <ChatInput
          name={otherMember.profile.name}
          type="conversation"
          apiUrl="/api/socket/directMessages"
          query={{
            conversationId: conversationId,
            memberId: member.id,
            otherMemberId: otherMember.id,
          }}
        />
      </>
    );
  }
}

export default ChatContent;
