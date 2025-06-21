import { useSocket } from "@/components/provider/socket-provider";
import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;

  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

export function useChatQuery({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: ChatQueryProps) {
  const { isConnected } = useSocket();

  async function fetchMessages({ pageParam = undefined }) {
    const url = qs.stringifyUrl({
      url: apiUrl,
      query: {
        cursor: pageParam,
        //channelId
        [paramKey]: paramValue,
      },
    });
    const res = await fetch(url);
    return res.json();
  }
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000,
      //refetchInterval: isConnected ? false : false,
    });
  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
}
