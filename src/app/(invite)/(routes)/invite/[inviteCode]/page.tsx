import { currentProfile } from "@/lib/current-profile";
import db from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

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

  const existServer = await db.server.findFirst({
    where: {
      inviteCode: inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (existServer) {
    return redirect(`/servers/${existServer.id}`);
  }
  const server = await db.server.update({
    where: {
      inviteCode: inviteCode,
    },
    data: {
      members: {
        create: [{ profileId: profile.id }],
      },
    },
  });
  if (server) {
    return redirect(`/servers/${server.id}`);
  }
  // TODO: 增加确认接受邀请界面。
  return <div>this is a invite page</div>;
}

export default InviteCodePage;
