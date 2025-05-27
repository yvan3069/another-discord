import { auth } from "@clerk/nextjs/server";
import { cache } from "react";

import db from "@/lib/db";

export const currentProfile = cache(async () => {
  console.time("CurrentProfile: auth");
  const { userId } = await auth();
  console.timeEnd("CurrentProfile: auth");

  if (!userId) return null;

  console.time("CurrentProfile: profile");
  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  });
  console.timeEnd("CurrentProfile: profile");
  return profile;
});
