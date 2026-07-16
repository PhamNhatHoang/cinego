"use client";

import React from "react";
import Modal from "./Modal";
import Button from "./Button";
import { Warning } from "@phosphor-icons/react";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  isDanger = false,
  isLoading = false,
}) => {
  const [localLoading, setLocalLoading] = React.useState(false);

  const handleConfirm = async () => {
    try {
      setLocalLoading(true);
      await onConfirm();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLocalLoading(false);
    }
  };

  const activeLoading = isLoading || localLoading;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-6 pt-2">
        <div className="flex items-start gap-3">
          {isDanger && (
            <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center shrink-0">
              <Warning size={20} weight="duotone" />
            </div>
          )}
          <p className="text-sm text-muted-foreground leading-relaxed pt-1.5">
            {message}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={activeLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={isDanger ? "danger" : "primary"}
            size="sm"
            onClick={handleConfirm}
            isLoading={activeLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
