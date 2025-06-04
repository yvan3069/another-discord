import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthoriazed!", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("ServerId is missing", { status: 400 });
    }
    if (!params?.channelId) {
      return new NextResponse("ChannelId is missing", { status: 400 });
    }
    //console.log("start getting the server...");
    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: params.channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    console.log(server);
    return NextResponse.json({ server });
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { channelId: "string" } }
) {
  const profile = await currentProfile();
  const { searchParams } = new URL(req.url);
  const serverId = searchParams.get("serverId");
  const { name } = await req.json();

  if (!profile) {
    return new NextResponse("Unauthorized!", { status: 401 });
  }
  if (!serverId) {
    return new NextResponse("ServerId is missing", { status: 400 });
  }
  if (!params?.channelId) {
    return new NextResponse("ChannelId is missing", { status: 400 });
  }
  if (name === "general") {
    return new NextResponse("Channel name can't be general");
  }
  console.log("serverside------name " + name);
  const server = await db.server.update({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
          role: {
            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
          },
        },
      },
    },
    data: {
      channels: {
        update: {
          where: {
            id: params.channelId,
            name: {
              not: "general",
            },
          },
          data: {
            name: name,
          },
        },
      },
    },
  });

  return NextResponse.json({ server });
}
