"use client";

import React, { useEffect } from "react";
import clsx from "clsx";
import GenosButton from "../button/GenosButton";
import {
  InboxArrowDownIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

type ModalSize = "md" | "lg" | "xl" | "full" | "xl2";

type GenosModalProps = {
  show: boolean;
  title: string;
  onClose?: () => void;
  onSubmit?: () => void;
  onOpen?: () => void;
  size?: ModalSize;
  children: React.ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  withCloseButton?: boolean;
  isLoading?: boolean;

  // tambahan
  withChangeButton?: boolean;
  onChangeButton?: () => void;
  changeButtonLabel?: string;
};

const sizeClasses = {
  md: "w-full max-w-md",
  lg: "w-full max-w-3xl",
  xl: "w-full max-w-5xl",
  xl2: "w-full max-w-7xl",
  full: "w-full h-full",
};

export default function GenosModal({
  show,
  title,
  onClose,
  onSubmit,
  onOpen,
  size = "md",
  children,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  withCloseButton = true,
  isLoading = false,

  // default false
  withChangeButton = false,
  onChangeButton,
  changeButtonLabel = "Change",
}: GenosModalProps) {
  useEffect(() => {
    if (show && onOpen) onOpen();
  }, [show, onOpen]);

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center transition-all duration-300",
        show ? "opacity-100 visible" : "opacity-0 invisible"
      )}
    >
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 " onClick={onClose} />

      {/* Modal container */}
      <div
        className={clsx(
          "bg-gray-50  rounded-lg shadow-xl transform transition-all duration-300 relative",
          sizeClasses[size]
        )}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 ">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-gray-800 ">{title}</h2>

            {withChangeButton && (
              <GenosButton
                label={changeButtonLabel}
                color="gray"
                size="sm"
                round="md"
                outlined
                onClick={onChangeButton}
              />
            )}
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600  cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 overflow-y-auto max-h-[70vh]">{children}</div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200 ">
          {withCloseButton && (
            <GenosButton
              label={cancelLabel}
              color="gray"
              onClick={onClose}
              outlined
              round="lg"
            />
          )}
          {onSubmit && (
            <GenosButton
              label={submitLabel}
              selfStart
              color="primary"
              onClick={onSubmit}
              round="md"
              size="md"
              loading={isLoading}
              iconLeft={<InboxArrowDownIcon className="w-4 h-4" />}
            />
          )}
        </div>
      </div>
    </div>
  );
}
