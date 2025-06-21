// for page router
import { getAuth } from "@clerk/nextjs/server";

import db from "@/lib/db";
import { NextApiRequest } from "next";

export const currentProfilePage = async (req: NextApiRequest) => {
  console.time("CurrentProfilePages: auth");
  const { userId } = getAuth(req);
  console.timeEnd("CurrentProfilePages: auth");

  if (!userId) return null;

  console.time("CurrentProfilePages: profile");
  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  });
  console.timeEnd("CurrentProfilePages: profile");
  return profile;
};
