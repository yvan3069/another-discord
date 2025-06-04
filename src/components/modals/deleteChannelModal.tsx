"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppSelector } from "@/lib/hooks";
import {
  onClose,
  selectModalChannel,
  selectModalIsOpen,
  selectModalOpenType,
} from "@/store/features/createModalSlice";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Button } from "../ui/button";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import qs from "query-string";

function DeleteChannelModal() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const channel = useAppSelector(selectModalChannel);

  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();

  const handleClose = () => {
    dispatch(onClose());
  };

  const openType = useAppSelector(selectModalOpenType);
  const isOpen =
    useAppSelector(selectModalIsOpen) && openType === "deleteChannel";

  async function onDelete() {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: params?.serverId,
        },
      });
      await axios.delete(url);
      dispatch(onClose());
      router.refresh();
      //router.push(`/server/${params?.serverId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
    // try {
    //   setIsLoading(true);

    //   //   router.push("/");
    // } catch (err) {
    //   console.error(err);

    console.log(`/api/servers/${channel?.id}`);
  }

  if (!isMounted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete the channel
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-500 mt-2">
            Are you sure to delete{" "}
            <span className="font-semibold text-indigo-500 ">
              {channel?.name}
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isLoading}
              variant="ghost"
              onClick={() => {
                dispatch(onClose());
              }}
            >
              Cancel
            </Button>
            <Button disabled={isLoading} variant="primary" onClick={onDelete}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteChannelModal;
