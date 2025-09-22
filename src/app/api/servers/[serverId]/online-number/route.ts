import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import db from "@/lib/db";

interface paramType {
  type: "online";
}

// 40s
const diff = 40000;

export async function POST(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    const { type }: paramType = await req.json();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!params?.serverId) {
      return new NextResponse("Server Id Missing", { status: 400 });
    }

    // 找到当前服务器
    const targetServer = await db.server.findFirst({
      where: {
        id: params.serverId,
      },
      include: {
        members: true,
      },
    });
    // 在服务器的所以members中寻找当前用户是否在这个服务器中
    const identifiy = targetServer?.members.findIndex(
      (item) => item.profileId === profile.id
    );
    if (identifiy === -1)
      return new NextResponse("You have not joined the server");

    //正常通过
    if (type === "online") {
      //console.log(type, "test");
      await db.onlineUser.upsert({
        where: {
          online_user_profile_server_unique: {
            profileId: profile.id,
            serverId: params.serverId,
          },
        },
        update: { lastPing: new Date() },
        create: {
          profileId: profile.id,
          serverId: params.serverId,
          lastPing: new Date(),
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[SERVER_DI_LEAVE]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      serverId: string;
    };
  }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!params.serverId) {
      return new NextResponse("Server Id Missing", { status: 400 });
    }
    const onlineUsers = await db.onlineUser.findMany({
      where: {
        serverId: params.serverId,
        lastPing: {
          gte: new Date(Date.now() - diff),
        },
      },
    });
    //now only return online user numbers
    return NextResponse.json({
      onlineUserCount: onlineUsers.length,
    });
  } catch (err) {
    console.error(err);
  }
}
