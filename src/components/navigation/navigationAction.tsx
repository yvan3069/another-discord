"use client";

import { Plus } from "lucide-react";
import ActionTooltip from "../actionTooltip";
import { useAppDispatch } from "@/lib/hooks";
import { ModalType, onOpen } from "@/store/features/createModalSlice";
// import { useHandleModalOpen } from "@/hooks/useModal";

function NavigationAction() {
  const dispatch = useAppDispatch();
  const handleModalOpen = (type: ModalType) => {
    dispatch(onOpen(type));
  };
  return (
    // TODO button看起来十分不流畅，让过渡动画更加自然,删除了边角的动画
    <div>
      <ActionTooltip label="create a new server" side="left">
        <button
          className="group flex items-center "
          onClick={() => handleModalOpen({ openType: "createServer" })}
        >
          <div className="flex mx-3 h-[48px] w-[48px] rounded-full transition-all duration-75 overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
            <Plus
              className="group-hover:text-white transition-all duration-75 text-emerald-500"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
}

export default NavigationAction;
