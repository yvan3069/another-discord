import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import AcceptPageContent from "./AcceptPageContent";
import RedirectCountdown from "./RedirectCountdown";

interface InviteCodeParams {
  params: {
    inviteCode: string;
  };
}

async function InviteCodePage({ params }: InviteCodeParams) {
  const profile = await currentProfile();

  const inviteCode = params.inviteCode;
  if (!profile) return <RedirectToSignIn />;
  if (!inviteCode) return redirect("/");

  const targetServer = await db.server.findFirst({
    where: {
      inviteCode: inviteCode,
    },
    include: {
      _count: {
        select: { members: true },
      },
    },
  });
  if (!targetServer) return redirect("/");

  const hasJoinedServer = await db.server.findFirst({
    where: {
      inviteCode: inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (hasJoinedServer) {
    return <RedirectCountdown serverId={hasJoinedServer.id} />;
  }

  // TODO: 绘制确认接受邀请界面。
  // TODO: 如何显示在线人数？ create a table, online add, offline decrease, maybe using heartbeat
  //TODO: 也许已读和未读也可以用这样显示。
  const serverInfo = {
    name: targetServer.name,
    imgUrl: targetServer.imageUrl,
    totalNumber: targetServer._count.members,
  };
  return <AcceptPageContent inviteCode={inviteCode} serverInfo={serverInfo} />;
}

export default InviteCodePage;
