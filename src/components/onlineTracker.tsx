"use client";
import { useEffect } from "react";

interface OnlineTrackerProps {
  serverId: string;
}

function OnlineTracker({ serverId }: OnlineTrackerProps) {
  useEffect(() => {
    const url = `/api/servers/${serverId}/online-number`;
    const timeId = setInterval(() => {
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "online",
        }),
      });
    }, 10000);
    return () => clearInterval(timeId);
  }, [serverId]);
  return null;
}

export default OnlineTracker;
