/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSocket } from "@/components/provider/socket-provider";
import { Member, Message, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

type MessageWithMemberWithProps = Message & {
  member: Member & {
    profile: Profile;
  };
};

export function useChatSocket({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) {
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!socket) return;

    socket.on(updateKey, (message: MessageWithMemberWithProps) => {
      console.log("receive", updateKey);

      queryClient.setQueryData([queryKey], (oldData: any) => {
        console.log("oldData", oldData);
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }
        //{pages: [items:[]], pageParams:[undefined,2,3]}
        // newData for page
        //TODO: 解决同步信息出错问题
        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMemberWithProps) => {
              if (item.id === message.id) {
                return message;
              }
              return item;
            }),
          };
        });
        console.log("newData", newData);
        console.log("return value", {
          ...oldData,
          pages: newData,
        });
        return {
          ...oldData,
          pages: newData,
        };
      });
    });
    socket.on(addKey, (message: MessageWithMemberWithProps) => {
      // console.log("receive", addKey);
      queryClient.setQueryData([queryKey], (oldData: any) => {
        //console.log(oldData);
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            ...oldData,
            page: [{ item: [message] }],
          };
        }

        const newData = [...oldData.pages];
        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        };
        return {
          ...oldData,
          pages: newData,
        };
      });
    });
    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [addKey, queryClient, queryKey, socket, updateKey]);
}
