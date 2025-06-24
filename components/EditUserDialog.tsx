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
import { Edit, Plus } from 'lucide-react';
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

type EditUserDialogProps = {
  user: User;
};

const putUser = async (userData: User) => {
  const res = await fetch(`${API_BASE_URL}/users/${userData.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  return res.json();
};

export default function EditUserDialog({ user }: EditUserDialogProps) {
  const queryClient = getQueryClient();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const updateUser = useMutation({
    mutationKey: ['users'],
    mutationFn: putUser,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsEditDialogOpen(false);

      toast.success('User created!');
    },
    onError: () => {
      toast.error('Error creating user');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formDataObj = new FormData(form);

    const name = formDataObj.get('edit-name') as string;
    const email = formDataObj.get('edit-email') as string;

    updateUser.mutate({
      ...user,
      name: name,
      email: email,
    });
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          <Edit className='w-4 h-4' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update the user information below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='space-y-4'>
            <div>
              <Label htmlFor='edit-name'>Name *</Label>
              <Input
                id='edit-name'
                name='edit-name'
                defaultValue={user.name}
                placeholder='Enter user name'
                required
              />
            </div>
            <div>
              <Label htmlFor='edit-email'>Email *</Label>
              <Input
                id='edit-email'
                name='edit-email'
                type='email'
                defaultValue={user.email}
                placeholder='Enter email address'
                required
              />
            </div>
          </div>
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
              // disabled={submitting}
            >
              {/* {submitting && <Loader2 className='w-4 h-4 mr-2 animate-spin' />} */}
              Update User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
