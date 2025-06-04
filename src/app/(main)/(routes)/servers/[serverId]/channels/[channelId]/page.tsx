import ChatHeader from "@/components/chat/chat-header";
import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

async function ChannelIdPage({ params }: ChannelIdPageProps) {
  const profile = await currentProfile();
  const { serverId, channelId } = params;
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
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        serverId={serverId}
        name={channel.name}
        type="channel"
        profile={profile}
      />
    </div>
  );
}

export default ChannelIdPage;
