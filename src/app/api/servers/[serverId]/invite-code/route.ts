import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthoried!", { status: 401 });
    }
    if (!params.serverId) {
      return new NextResponse("Server id missing", { status: 400 });
    }

    //generate new link, prevent not-admin from creating new links
    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });
    return NextResponse.json({ server });
  } catch (err) {
    console.log(`serverId,`, err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
