import { initialProfile } from "@/lib/initial-profile";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import InitialModal from "@/components/modals/initialModal";

async function page() {
  const profile = await initialProfile();
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    redirect(`/servers/${server.id}`);
  }
  return <InitialModal />;
}

export default page;
