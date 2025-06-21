"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useTheme } from "next-themes";

interface EmojiPicker {
  onChange: (value: string) => void;
}

function EmojiPicker({ onChange }: EmojiPicker) {
  const { resolvedTheme } = useTheme();
  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="text-zinc-500 dark:text-zinc-4-- hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
      </PopoverTrigger>
      <PopoverContent
        className="bg-transparent border-none shadow-none drop-shadow-none"
        side="left"
      >
        <Picker
          data={data}
          theme={resolvedTheme}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  );
}

export default EmojiPicker;
