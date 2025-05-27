import { currentProfile } from "@/lib/current-profile";
import { RedirectToSignIn } from "@clerk/nextjs";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import ServerSidebar from "@/components/server/server-sidebar";

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

  console.time("ServerIdLayout: db.server.findUnique"); // 开始计时: 数据库查询
  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
    },
    include: {
      channels: {
        orderBy: {
          name: "asc", // Replace 'name' with a valid field in the 'channels' table
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });
  console.timeEnd("ServerIdLayout: db.server.findUnique"); // 结束计时: 数据库查询

  if (!server) return redirect("/");

  const isMember = server.members.some(
    (member) => member.profileId === profile.id
  );
  if (!isMember) {
    // 如果不希望非成员看到任何内容，或者没有权限访问这个 serverId，则重定向
    // 这个逻辑取决于你的业务需求。如果 ServerIdLayout 应该只对成员可见，
    // 那么这个检查是必要的。
    console.warn(
      `User ${profile.id} is not a member of server ${server.id}. Redirecting.`
    );
    console.timeEnd("ServerIdLayout: Total Execution");
    return redirect("/"); // 或者抛出一个错误，或者显示一个“无权限”页面
  }

  const layoutRenderStart = performance.now();
  const result = (
    <div className="h-full ">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar server={server} profile={profile} />
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
