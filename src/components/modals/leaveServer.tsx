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
  selectModalOpenType,
} from "@/store/features/createModalSlice";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Button } from "../ui/button";

import axios from "axios";
import { useRouter } from "next/navigation";

function LeaveServerModal() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const data = useAppSelector(selectModalData);
  const server = data?.server;

  const dispatch = useDispatch();
  const router = useRouter();

  const handleClose = () => {
    dispatch(onClose());
  };

  const openType = useAppSelector(selectModalOpenType);
  const isOpen =
    useAppSelector(selectModalIsOpen) && openType === "leaveServer";

  async function onLeave() {
    try {
      setIsLoading(true);
      await axios.patch(`/api/servers/${server?.id}/leave`);

      dispatch(onClose());
      router.refresh();
      //   router.push("/");
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
            Leave the Server
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-500 mt-2">
            Are you sure to leave{" "}
            <span className="font-semibold text-indigo-500 ">
              {server?.name}
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
            <Button disabled={isLoading} variant="primary" onClick={onLeave}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default LeaveServerModal;
