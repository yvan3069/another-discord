import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { Suspense } from "react";
import { ChannelPageDefalut } from "@/components/loading/channel-page-default";
import ChatContent from "@/components/chat/chat-content";
import ChatHeader from "@/components/chat/chat-header";

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
}

async function MemberIdPage({ params }: MemberIdPageProps) {
  console.time("ConversationPage: currentProfile");
  const profile = await currentProfile();
  console.timeEnd("ConversationPage: currentProfile");
  if (!profile) {
    return <RedirectToSignIn />;
  }

  console.time("ConversationPage: db.member.findFirst");
  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });
  console.timeEnd("ConversationPage: db.member.findFirst");
  if (!currentMember) {
    return redirect("/");
  }
  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  );

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }
  const { memberOne, memberTwo } = conversation;
  const otherMember =
    memberOne.profile.id === profile.id ? memberTwo : memberTwo;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <Suspense fallback={<ChannelPageDefalut />}>
        <ChatContent
          serverId={params.serverId}
          conversationId={conversation.id}
          type="conversation"
          otherMember={otherMember}
        />
      </Suspense>
    </div>
  );
}

export default MemberIdPage;
