"use client";

import { useParams } from "next/navigation";
import ActionTooltip from "../actionTooltip";

import { cn } from "@/lib/utils";

import Image from "next/image";
import Link from "next/link";

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

function NavigationItem({ id, imageUrl, name }: NavigationItemProps) {
  const parmas = useParams();

  return (
    <ActionTooltip side="left" label={name}>
      <Link
        href={`/servers/${id}`}
        passHref
        legacyBehavior={false}
        className="group relative flex items-center"
      >
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px] ",
            parmas?.serverId !== id && "group-hover:h-[20px]",
            parmas?.serverId === id ? "h-[36px]" : "h-[8px]"
          )}
        />
        <div
          className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            parmas?.serverId === id &&
              "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          <Image
            fill
            src={imageUrl}
            alt={name}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
    </ActionTooltip>
  );
}

export default NavigationItem;
