import { currentProfile } from "@/lib/current-profile";

import db from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ServerIdPageProps {
  params: {
    serverId: string;
  };
}

async function page({ params }: ServerIdPageProps) {
  const profile = await currentProfile();
  if (!profile) {
    return <RedirectToSignIn />;
  }
  console.time("ServerIdPage: db.server.findUnique"); // 开始计时: 数据库查询
  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          name: "asc",
        },
      },
    },
  });
  console.timeEnd("ServerIdPage: db.server.findUnique"); // 开始计时: 数据库查询
  const initialChannel = server?.channels[0];

  if (initialChannel?.name !== "general") {
    return null;
  }

  return redirect(`/servers/${params.serverId}/channels/${initialChannel.id}`);
}

export default page;
