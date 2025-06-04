"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  //   FormDescription,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  onClose,
  selectModalChannel,
  selectModalIsOpen,
  selectModalOpenType,
} from "@/store/features/createModalSlice";
import qs from "query-string";
import { useEffect } from "react";

function EditChannelModal() {
  const formSchema = z.object({
    name: z.string().min(1, {
      message: "server name is required",
    }),
    // imageUrl: z.string().min(1, {
    //   message: "image is required",
    // }),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const router = useRouter();

  const openType = useAppSelector(selectModalOpenType);
  const isOpen =
    useAppSelector(selectModalIsOpen) && openType === "editChannel";
  const dispatch = useAppDispatch();
  const channel = useAppSelector(selectModalChannel);
  const params = useParams();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: params?.serverId,
        },
      });
      console.log(values);
      await axios.patch(url, values);
      form.reset();
      router.refresh();
      dispatch(onClose());
    } catch (err) {
      console.error(err);
    }
  };
  const handleClose = () => {
    dispatch(onClose());
  };
  useEffect(() => {
    if (channel) {
      form.setValue("name", channel.name);
    }
  }, [channel, form]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Edit your channel
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            You can change the name of the channel here
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      channel name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="bg-gray-100 px-1 py-4 ">
                <Button variant="primary" disabled={isLoading}>
                  Save
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditChannelModal;
