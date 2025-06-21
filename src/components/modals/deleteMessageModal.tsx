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
  selectModalData,
  selectModalIsOpen,
  selectModalMessageId,
  selectModalOpenType,
  selectModalSocketQuery,
  selectModalSocketUrl,
} from "@/store/features/createModalSlice";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Button } from "../ui/button";
import qs from "query-string";

import axios from "axios";
import { useRouter } from "next/navigation";

function DeleteMessageModal() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  //const data = useAppSelector(selectModalData);
  //const server = data?.server;

  const dispatch = useDispatch();
  const socketUrl = useAppSelector(selectModalSocketUrl);
  const messageId = useAppSelector(selectModalMessageId);
  const socketQuery = useAppSelector(selectModalSocketQuery);
  const router = useRouter();

  const handleClose = () => {
    dispatch(onClose());
  };

  const openType = useAppSelector(selectModalOpenType);
  const isOpen =
    useAppSelector(selectModalIsOpen) && openType === "deleteMessage";

  async function onDelete() {
    //console.log("deleted!!");
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${messageId}`,
        query: socketQuery,
      });
      await axios.delete(url);
      dispatch(onClose());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isMounted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete the Message
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-500 mt-2">
            Are you sure to delete the message?
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

export default DeleteMessageModal;
