import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { inviteCode } = await req.json();
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
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
    return NextResponse.json(server);
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
