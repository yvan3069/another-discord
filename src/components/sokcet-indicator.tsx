"use client";

import { useSocket } from "@/components/provider/socket-provider";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

function SocketIndicator() {
  const { isConnected } = useSocket();
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-white, border-none",
        isConnected
          ? "bg-emerald-100 dark:bg-emerald-600"
          : "bg-yellow-100 dark:bg-yellow-600"
      )}
    >
      {isConnected ? "Live: Realtime updates" : "Fallback: Polling every 1s"}
    </Badge>
  );
}

export default SocketIndicator;
