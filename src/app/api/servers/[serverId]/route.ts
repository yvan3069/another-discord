import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { serverId: string };
  }
) {
  const { name, imageUrl } = await req.json();
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        name: name,
        imageUrl: imageUrl,
      },
    });

    return NextResponse.json({ server });
  } catch (err) {
    console.error(err);
    return new NextResponse("Interal Error", { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { serverId: string };
  }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!params.serverId) {
      return new NextResponse("ServerId is missing", { status: 400 });
    }
    const server = await db.server.delete({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
    });
    return NextResponse.json({ server });
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
