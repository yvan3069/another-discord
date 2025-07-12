"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

interface PageContentProps {
  inviteCode: string;
}

function AcceptPageContent({ inviteCode }: PageContentProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [getError, setGetError] = useState(false);
  async function onAgree() {
    try {
      setIsLoading(true);
      const server = await axios.post("/api/servers/join", {
        inviteCode: inviteCode,
      });
      setIsLoading(false);
      router.push(`/servers/${server.data.id}`);
    } catch (err) {
      console.error(err);

      setGetError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-b from-[#19175a] to-[#5865F2]">
      {getError && <p>Errors</p>}
      {!isLoading && (
        <div className="cursor-default select-none space-y-2 rounded-sm bg-[#f2f3f5] p-4 dark:bg-[#2b2d31] shadow-xl">
          <p className="text-xs font-semibold uppercase text-[#4e5058] dark:text-[#b5bac1]">
            You&apos;ve been invited to join a server
          </p>
          <div className="flex items-center justify-between gap-16">
            <Image
              src="https://cdn.discordapp.com/embed/avatars/0.png?size=128"
              alt="Discord"
              width={56}
              height={56}
              className="h-14 w-14 rounded-xl"
              draggable={false}
              unoptimized
            />

            <div>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://discord.com"
              >
                <h1 className="cursor-pointer font-normal text-[#060607] hover:underline dark:text-white">
                  Discord
                </h1>
              </a>
              <div className="flex items-center justify-between gap-3 text-xs">
                <p className="text-[#80848e]">
                  <span className="inline-flex">
                    <svg
                      className="h-[0.6rem] w-[0.6rem] fill-indigo-500"
                      stroke-width="0"
                      viewBox="0 0 512 512"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M256 23.05C127.5 23.05 23.05 127.5 23.05 256S127.5 488.9 256 488.9 488.9 384.5 488.9 256 384.5 23.05 256 23.05z"></path>
                    </svg>
                  </span>
                  560 Online
                </p>
                <p className="text-[#80848e]">
                  <span className="inline-flex">
                    <svg
                      className="h-[0.6rem] w-[0.6rem] fill-[#b5bac1] dark:fill-[#4e5058]"
                      stroke-width="0"
                      viewBox="0 0 512 512"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M256 23.05C127.5 23.05 23.05 127.5 23.05 256S127.5 488.9 256 488.9 488.9 384.5 488.9 256 384.5 23.05 256 23.05z"></path>
                    </svg>
                  </span>
                  3,632 Members
                </p>
              </div>
            </div>

            <button
              className="focus-visible:ring-ring ring-offset-background inline-flex h-10 items-center justify-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-[#e9ffec] transition-colors hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              onClick={() => onAgree()}
            >
              Join
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default AcceptPageContent;
