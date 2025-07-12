"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function RedirectCountdown({ serverId }: { serverId: string }) {
  // 3 seconds
  const [countdown, setCountdown] = useState(3);
  const router = useRouter();
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined = undefined;
    if (countdown <= 0) {
      // fix when the timer is less than 0s
      router.push(`/servers/${serverId}`);
      setCountdown(0);
    } else {
      // every 1000ms
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }

    return () => {
      if (timer !== undefined) {
        clearTimeout(timer);
      }
    };
  }, [countdown, router, serverId]);
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center gap-y-4">
      <h1>
        You have joined this server! Redirecting in {countdown} seconds ...
      </h1>
    </div>
  );
}

export default RedirectCountdown;
