import ChatContent from "@/components/chat/chat-content";
import { ChannelPageDefalut } from "@/components/loading/channel-page-default";
import { Suspense } from "react";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

async function ChannelIdPage({ params }: ChannelIdPageProps) {
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <Suspense fallback={<ChannelPageDefalut />}>
        <ChatContent serverId={params.serverId} channelId={params.channelId} />
      </Suspense>
    </div>
  );
}

export default ChannelIdPage;
