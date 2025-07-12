import { currentProfile } from "@/lib/current-profile";
import { RedirectToSignIn } from "@clerk/nextjs";

import ServerSidebar from "@/components/server/server-sidebar";
import { Suspense } from "react";
import ServerSidebarDefault from "@/components/loading/server-sidebar-default";

async function ServerIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}): Promise<JSX.Element> {
  console.time("ServerIdLayout: Total Execution");

  console.time("ServerIdLayout: currentProfile");
  const profile = await currentProfile();
  console.timeEnd("ServerIdLayout: currentProfile");

  if (!profile) return <RedirectToSignIn redirectUrl="/sign-in" />;

  const layoutRenderStart = performance.now();
  const result = (
    <div className="h-full ">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <Suspense fallback={<ServerSidebarDefault />}>
          <ServerSidebar serverId={params.serverId} profile={profile} />
        </Suspense>
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
  const layoutRenderEnd = performance.now();
  console.log(
    `ServerIdLayout: Component Rendering took ${
      layoutRenderEnd - layoutRenderStart
    }ms`
  );
  console.timeEnd("ServerIdLayout: Total Execution");
  return result;
}

export default ServerIdLayout;
