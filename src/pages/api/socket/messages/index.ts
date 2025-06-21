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
    const { serverId, channelId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "ServerId Missing" });
    }
    if (!channelId) {
      return res.status(400).json({ error: "ChannelId Missing" });
    }
    if (!content) {
      return res.status(400).json({ error: "Content Missing" });
    }
    console.time("apiSocket Messages db.server.findFirst");
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
    console.timeEnd("apiSocket Messages db.server.findFirst");
    if (!server) {
      return res.status(404).json({ error: "Server Not found" });
    }
    console.time("apiSocket Messages db.channel.findFirst");
    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });
    console.timeEnd("apiSocket Messages db.channel.findFirst");
    if (!channel) {
      return res.status(404).json({ error: "Channel Not Found" });
    }
    const member = server.members.find(
      (member) => member.profileId === profile.id
    );
    if (!member) {
      return res.status(404).json({ error: "Member Not Found" });
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const addKey = `chat:${channelId}:messages`;

    console.log(addKey, "emitted by index.ts");
    res?.socket?.server?.io.emit(addKey, message);

    return res.status(200).json(message);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Error" });
  }
}
