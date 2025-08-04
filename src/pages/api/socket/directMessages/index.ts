import { currentProfilePage } from "@/lib/current-profile-pages";
import { NextApiResponseServerIo } from "@/type";
import { NextApiRequest } from "next";
import db from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePage(req);
    const { content, fileUrl } = req.body;
    const { memberId, conversationId, otherMemberId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!memberId || !otherMemberId) {
      return res.status(400).json({ error: "MemberId Missing" });
    }
    if (!conversationId) {
      return res.status(400).json({ error: "ChannelId Missing" });
    }
    if (!content) {
      return res.status(400).json({ error: "Content Missing" });
    }

    console.time("apiSocket directMessges db.conversation.findFirst");
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        AND: [
          { memberOneId: memberId as string },
          { memberTwoId: otherMemberId as string },
        ],
      },
    });
    console.timeEnd("apiSocket directMessges db.conversation.findFirst");
    console.log(conversation, memberId, otherMemberId);
    if (!conversation) {
      return res.status(404).json({ error: "conversation Not Found" });
    }

    console.log(fileUrl);
    const directMessage = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
        memberId: memberId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const addKey = `chat:${conversationId}:messages`;

    console.log(addKey, "emitted by index.ts");
    if (res?.socket?.server?.io) {
      res.socket.server.io.emit(addKey, directMessage);
    } else if (typeof io !== "undefined") {
      io.emit(addKey, directMessage);
    }

    return res.status(200).json(directMessage);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Error" });
  }
}
