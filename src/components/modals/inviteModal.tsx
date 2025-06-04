"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppSelector } from "@/lib/hooks";
import {
  onClose,
  onOpen,
  selectModalData,
  selectModalIsOpen,
  selectModalOpenType,
  serializeServer,
} from "@/store/features/createModalSlice";

import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Check, Copy, RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import { useOrigin } from "@/hooks/use-orgin";
import axios from "axios";

function InviteModal() {
  const [isMounted, setIsMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const data = useAppSelector(selectModalData);
  const server = data?.server;

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(onClose());
  };

  const openType = useAppSelector(selectModalOpenType);
  const isOpen = useAppSelector(selectModalIsOpen) && openType === "invite";

  const orgin = useOrigin();
  const inviteUrl = `${orgin}/invite/${server?.inviteCode || "defalut"}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }

    timer.current = setTimeout(() => {
      setCopied(false);
    }, 1000);
  };
  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );
      // fit the redux
      const data = response.data;
      const serializeData = { server: serializeServer(data.server) };
      dispatch(onOpen({ openType: "invite", data: serializeData }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, []);

  if (!isMounted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Friends
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-500 mt-2">
            Share this link with your friends to invite them to the server.
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-sx font-bold text-zinc-500 dark:text-secondary/70">
            Sever Invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 "
              value={inviteUrl}
              readOnly
              disabled={isLoading}
            />
            <Button size="icon" onClick={() => onCopy()} disabled={isLoading}>
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button
            variant="link"
            size="sm"
            className="text-xs text-zinc-500 mt-4"
            onClick={() => onNew()}
            disabled={isLoading}
          >
            Generate a new link
            <RefreshCcw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default InviteModal;
