// src/app/layout.tsx (或你的根布局文件)
import type { Metadata } from "next";
//import { Open_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/provider/theme-provider";
import StoreProvider from "@/components/provider/store-provider"; // 导入新的 Provider
import { cn } from "@/lib/utils";
import { clerkPublicKey } from "@/constants";
import { SocketProvider } from "@/components/provider/socket-provider";
import { QueryProvider } from "@/components/provider/query-provider";
// 不再需要 useRef, makeStore, AppStore, Provider from react-redux

const font = localFont({
  src: "../fonts/OpenSans-Regular.ttf",
});

export const metadata: Metadata = {
  title: "discord",
  description: "discord clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // RootLayout 现在可以保持为服务端组件（除非其他依赖项强制它成为客户端组件）
  // store 的创建和 Provider 的设置被委托给了 StoreProvider 客户端组件

  return (
    <ClerkProvider afterSignOutUrl="/" publishableKey={clerkPublicKey}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            font.className,
            "bg-white dark:bg-[#313338] !pointer-events-auto"
          )}
        >
          {/* ThemeProvider 通常可以包裹 StoreProvider 或反之，取决于依赖关系 */}
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
            storageKey="discord-clone"
          >
            <SocketProvider>
              {/* 使用 StoreProvider 包裹 children */}
              <StoreProvider>
                <QueryProvider>{children}</QueryProvider>
              </StoreProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
