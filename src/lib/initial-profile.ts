import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import db from "./db";

export const initialProfile = async () => {
  const user = await currentUser();
  // later
  if (!user) {
    return redirect("/sign-in");
  }
  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (profile) {
    return profile;
  }
  // if no profile, create a new profile
  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name:
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.username || "Unknown User",
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });
  return newProfile;
};
