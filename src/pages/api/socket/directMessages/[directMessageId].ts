import { currentProfilePage } from "@/lib/current-profile-pages";
import { NextApiResponseServerIo } from "@/type";
import db from "@/lib/db";
import { NextApiRequest } from "next";

//currently for deleting and updating messages in realtime using websocket
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    const profile = await currentProfilePage(req);
    const { directMessageId, conversationId } = req.query;
    console.log(req.query);

    //chat-item form
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!conversationId) {
      return res.status(400).json({ error: "channelId is missing" });
    }

    console.time("/api/socket/[directMessageId]:conversation.findFirst");
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
      },
    });
    console.timeEnd("/api/socket/[directMessageId]:conversation.findFirst");
    if (!conversation) {
      return res.status(404).json({ error: "Conversation Not Found" });
    }

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({ error: "Message Not Found" });
    }
    const isMessageOwner = directMessage.member.profile.id === profile.id;

    const canModify = isMessageOwner;

    if (!canModify) {
      return res.status(401).json({ error: "No permission" });
    }
    if (req.method === "DELETE") {
      console.time("/api/socket/[messageId]:message delete");
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted!",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
      console.timeEnd("/api/socket/[messageId]:message delete");
    }
    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({ error: "Not the owner" });
      }
      console.timeEnd("/api/socket/[messageId]:message patch");
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          content: content,
          updatedAt: new Date(),
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
      console.timeEnd("/api/socket/[messageId]:message patch");
    }

    const updateKey = `chat:${conversationId}:messages:update`;
    console.log("update message!", updateKey);
    res?.socket?.server?.io?.emit(updateKey, directMessage);

    return res.status(200).json(directMessage);
  } catch (err) {
    console.error("[meessageId]", err);
    return res.status(500).json({ error: "Internal Error" });
  }
}
