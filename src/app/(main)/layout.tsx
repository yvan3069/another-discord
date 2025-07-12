import NavigationSidebarDefault from "@/components/loading/navigation-sidebar-default";
import NavigationSidebar from "@/components/navigation/navigationSidebar";
import { Suspense } from "react";

async function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <Suspense fallback={<NavigationSidebarDefault />}>
          <NavigationSidebar />
        </Suspense>
      </div>
      <main className="md:pl-[72px] h-full">
        {/*TODO: 提高首屏进入时间 */}
        <Suspense fallback={"Loading"}>{children}</Suspense>
      </main>
    </div>
  );
}

export default MainLayout;
