/**
 * DeletePropertyDialog.tsx - Delete Property Confirmation Dialog
 * ==============================================================
 * 
 * Confirmation dialog for deleting properties using shadcn AlertDialog.
 */

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeletePropertyDialogProps {
  isOpen: boolean;
  propertyTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeletePropertyDialog: React.FC<DeletePropertyDialogProps> = ({
  isOpen,
  propertyTitle,
  onConfirm,
  onCancel
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Una uhakika unataka kufuta nyumba hii?</AlertDialogTitle>
          <AlertDialogDescription>
            Unataka kufuta <span className="font-semibold text-gray-900">"{propertyTitle}"</span>.
            Hatua hii haiwezi kutenduliwa. Nyumba itafutwa kabisa kutoka kwenye mfumo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            Ghairi (Cancel)
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            Futa (Delete)
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePropertyDialog;
