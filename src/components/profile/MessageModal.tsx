"use client";
import React, { memo, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { toast } from "@/hooks/use-toast";
import { User } from "@/types/user";
import { useSocket } from "@/contexts/SocketContext";
import { useRouter } from "next/navigation";

interface MessageForm {
  text: string;
}

interface MessageModalProps {
  recepient: User;
  sender: User;
}

const MessageModal: React.FC<MessageModalProps> = ({ recepient }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { socket } = useSocket();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessageForm>();

  const onSubmit = useCallback(
    async (data: MessageForm) => {
      if (!socket) {
        toast({
          title: "Error",
          description: "Could not connect to the server",
          variant: "destructive",
        });
        return;
      }
      // Placeholder for message sending logic
      socket.emit("sendMessage", { text: data.text, to: recepient._id });
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully!",
      });
      reset();
      setIsOpen(false);
      // router.push(`/connect/${recepient._id}`); //we are going to implement this later
      router.push(`/connect`);
    },
    [reset, socket, recepient._id],
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="text-lg w-full !mt-2"
            onClick={() => setIsOpen(true)}
          >
            Message
          </Button>
        </DialogTrigger>
        <DialogContent className="py-8 w-full sm:w-[420px]">
          <DialogHeader>
            <DialogTitle>Message {recepient.fullName}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Textarea
              placeholder="Your Message"
              className="w-full h-52 p-4 resize-none border rounded-none focus:border-none"
              {...register("text", { required: "Message cannot be empty" })}
            />
            {errors.text && (
              <p className="text-red-500">{errors.text.message}</p>
            )}
            <div className="flex justify-end mt-4 space-x-2">
              <Button
                variant="ghost"
                className="px-4 py-2 text-red-500"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Send</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default memo(MessageModal);
