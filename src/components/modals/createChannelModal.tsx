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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  onClose,
  selectModalIsOpen,
  selectModalOpenType,
} from "@/store/features/createModalSlice";
import { ChannelType } from "@prisma/client";
import qs from "query-string";

function CreateChannelModal() {
  const formSchema = z.object({
    name: z
      .string()
      .min(1, {
        message: "server name is required",
      })
      .refine((name) => name !== "general", {
        message: "Channel name cannot be 'general'",
      }),
    type: z.nativeEnum(ChannelType),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: ChannelType.TEXT,
    },
  });

  const isLoading = form.formState.isSubmitting;
  const router = useRouter();
  const params = useParams();
  // const isOpen = useIsModalOpen();
  // const handleClose = useHandleModalClose();
  const openType = useAppSelector(selectModalOpenType);
  const isOpen =
    useAppSelector(selectModalIsOpen) && openType === "createChannel";
  const dispatch = useAppDispatch();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const url = qs.stringifyUrl({
        url: "/api/channels",
        query: {
          serverId: params?.serverId,
        },
      });
      await axios.post(url, values);

      form.reset();
      router.refresh();
      dispatch(onClose());
      console.log(form);
    } catch (err) {
      console.error(err);
    }
  }

  const handleClose = () => {
    dispatch(onClose());
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Create Your Channel
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give it a name , you can always change it later
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
                      server name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter the channel name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Choose channel type
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="Choose a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent {...field}>
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="capitalize"
                          >
                            {type.toLocaleLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="bg-gray-100 px-1 py-4 ">
                <Button variant="primary" disabled={isLoading}>
                  Create
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateChannelModal;
