"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "../ui/dialog";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import React, { memo, ReactNode } from "react";
import { cn } from "@/lib/utils";
import Spinner from "@/app/loading";

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isLoading?: boolean;
  handler: () => void;
  title?: string;
  triggerIcon?: React.ReactNode;
  customTriggerStyles?: string;
  customContainerStyles?: string;
  customButtonStyles?: string;
  children: ReactNode;
  loading?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  setIsOpen,
  isLoading = false,
  handler,
  title = "Confirm Action",
  triggerIcon = <Loader2 className="animate-spin" />,
  customTriggerStyles = "",
  customContainerStyles = "",
  customButtonStyles = "",
  children,
  loading = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Trigger */}
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          disabled={isLoading}
          onClick={() => setIsOpen(true)}
          className={`rounded-none ${customTriggerStyles}`}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : triggerIcon}
        </Button>
      </DialogTrigger>

      {/* Content */}
      <DialogContent
        className={`flex flex-col items-center space-y-4 ${customContainerStyles}`}
      >
        {loading ? (
          <Spinner />
        ) : (
          <>
            {title && <DialogTitle>{title}</DialogTitle>}
            {children}
            <div className="flex gap-4">
              <Button
                variant="destructive"
                onClick={handler}
                disabled={isLoading}
                className={customButtonStyles}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Confirm"}
              </Button>
              <Button
                autoFocus={true}
                variant="secondary"
                onClick={() => setIsOpen(false)}
                className={cn(
                  `focus:border focus:border-muted `,
                  customButtonStyles,
                )}
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default memo(Modal);
