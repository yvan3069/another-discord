import { currentProfile } from "@/lib/current-profile";
import { DirectMessage, Message } from "@prisma/client";
import { NextResponse } from "next/server";
import db from "@/lib/db";

// messages every query in useInfiniteQuery
const MESSAGE_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!conversationId) {
      return new NextResponse("Missing ChannelId", { status: 400 });
    }
    let directMessages: DirectMessage[];

    if (cursor) {
      directMessages = await db.directMessage.findMany({
        take: MESSAGE_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId: conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      });
    } else {
      directMessages = await db.directMessage.findMany({
        take: MESSAGE_BATCH,

        where: {
          conversationId: conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }
    let nextCursor = null;
    if (directMessages.length === MESSAGE_BATCH) {
      nextCursor = directMessages[MESSAGE_BATCH - 1].id;
    }
    return NextResponse.json({
      items: directMessages,
      nextCursor,
    });
  } catch (err) {
    console.error("MESSAGE GET ERROR", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
