import { currentProfilePage } from "@/lib/current-profile-pages";
import { NextApiResponseServerIo } from "@/type";
import db from "@/lib/db";
import { NextApiRequest } from "next";
import { MemberRole } from "@prisma/client";

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
    const { messageId, serverId, channelId } = req.query;
    console.log(req.query);

    //chat-item form
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!serverId) {
      return res.status(400).json({ error: "ServerId is missing" });
    }
    if (!channelId) {
      return res.status(400).json({ error: "channelId is missing" });
    }
    console.time("/api/socket/[messageId]:server.findFirst");
    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });
    console.timeEnd("/api/socket/[messageId]:server.findFirst");
    if (!server) {
      return res.status(404).json({ error: "Server Not Found" });
    }
    console.time("/api/socket/[messageId]:channel.findFirst");
    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });
    console.timeEnd("/api/socket/[messageId]:channel.findFirst");
    if (!channel) {
      return res.status(404).json({ error: "Channel Not Found" });
    }
    const member = server.members.find(
      (member) => member.profileId === profile.id
    );
    if (!member) {
      return res.status(404).json({ error: "Member Not Found" });
    }

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
    if (!message || message.deleted) {
      return res.status(404).json({ error: "Message Not Found" });
    }
    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isAdmin || isModerator || isMessageOwner;

    if (!canModify) {
      return res.status(401).json({ error: "No permission" });
    }
    if (req.method === "DELETE") {
      console.time("/api/socket/[messageId]:message delete");
      message = await db.message.update({
        where: {
          id: messageId as string,
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
      message = await db.message.update({
        where: {
          id: messageId as string,
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

    const updateKey = `chat:${channelId}:messages:update`;
    console.log("update message!", updateKey);

    if (res?.socket?.server?.io) {
      res.socket.server.io.emit(updateKey, message);
    } else if (typeof io !== "undefined") {
      io.emit(updateKey, message);
    }

    return res.status(200).json(message);
  } catch (err) {
    console.error("[meessageId]", err);
    return res.status(500).json({ error: "Internal Error" });
  }
}
