'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { API_BASE_URL } from '@/lib/utils';
import { getQueryClient } from '@/app/get-query-client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

type DeleteUserDialogProps = {
  user: User;
};

const deleteUser = async (userData: User) => {
  const res = await fetch(`${API_BASE_URL}/users/${userData.id}`, {
    method: 'DELETE',
  });

  if (res.status !== 204) {
    return res.json();
  }

  return null;
};

export default function DeleteUserDialog({ user }: DeleteUserDialogProps) {
  const queryClient = getQueryClient();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const deleteUserFn = useMutation({
    mutationKey: ['users'],
    mutationFn: deleteUser,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsEditDialogOpen(false);

      toast.success('User deleted!');
    },
    onError: () => {
      toast.error('Error deleting user');
    },
  });

  const handleDelete = () => {
    deleteUserFn.mutate(user);
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='text-destructive hover:text-destructive'
        >
          <Trash2 className='w-4 h-4' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete user?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className='mt-6'>
          <Button
            type='button'
            variant='outline'
            onClick={() => {
              setIsEditDialogOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            onClick={handleDelete}
            // disabled={submitting}
          >
            {/* {submitting && <Loader2 className='w-4 h-4 mr-2 animate-spin' />} */}
            Delete User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
