'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { deleteAccount } from '@/lib/actions/DeleteAccount';

export default function DeleteAccountButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await deleteAccount();
      if (result.success) {
        toast.success('Account deleted successfully');
        // Sign out and redirect
        await signOut({ callbackUrl: '/login' });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='destructive'
          className='bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 border border-red-900/50 w-full sm:w-auto'>
          Delete Account
        </Button>
      </DialogTrigger>
      <DialogContent className='bg-[#1c1c21] border border-white/10 text-white sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-red-500 flex items-center gap-2'>
            <Trash2 className='w-5 h-5' />
            Delete Account?
          </DialogTitle>
          <DialogDescription className='text-gray-400 mt-2'>
            Are you absolutely sure? This will permanently delete your account,
            disconnect your calendar, and remove all your data.
          </DialogDescription>
        </DialogHeader>

        <div className='flex items-center p-3 my-2 bg-red-900/10 border border-red-900/30 rounded-lg text-red-300 text-sm'>
          <AlertTriangle className='h-4 w-4 mr-2 flex-shrink-0' />
          This action cannot be undone.
        </div>

        <DialogFooter className='gap-2 sm:justify-end'>
          <Button
            variant='ghost'
            onClick={() => setOpen(false)}
            disabled={loading}
            className='hover:bg-white/10 text-gray-300'>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={loading}
            className='bg-red-600 hover:bg-red-700 text-white'>
            {loading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Deleting...
              </>
            ) : (
              'Yes, Delete Everything'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
