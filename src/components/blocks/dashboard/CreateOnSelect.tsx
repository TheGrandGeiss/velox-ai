import { Dialog, DialogContent } from '@/components/ui/dialog';
import React, { Dispatch, SetStateAction } from 'react';

const CreateOnSelect = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Dialog
      open
      onOpenChange={setOpen}>
      <DialogContent showCloseButton={false}></DialogContent>
    </Dialog>
  );
};

export default CreateOnSelect;
