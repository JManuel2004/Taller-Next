'use client';

import React from 'react';
import { Modal } from './Modal';
import { Button } from '@/components/ui';

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title = 'Confirmar',
  message = '¿Estás seguro?',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  isLoading = false,
  onConfirm,
  onClose,
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
    } finally {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <p className="text-sm text-gray-700">{message}</p>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={handleConfirm} isLoading={isLoading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
