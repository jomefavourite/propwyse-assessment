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
import { Loader2, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { API_BASE_URL } from '@/lib/utils';
import { getQueryClient } from '@/app/get-query-client';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface UserInput {
  name: string;
  email: string;
}

const postUser = async (userData: User) => {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  await new Promise((resolve) => setTimeout(resolve, 300));

  return res.json();
};

export default function AddUserDialog({
  users,
}: {
  users: User[] | undefined;
}) {
  const queryClient = getQueryClient();
  const { toast } = useToast();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<UserInput>({ name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);

  const createUser = useMutation({
    mutationKey: ['users'],
    mutationFn: postUser,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });

      setIsCreateDialogOpen(false);
      setFormData({ name: '', email: '' });
      toast({ title: 'User created!' });
    },
    onError: () => {
      toast({ variant: 'destructive', title: 'Error creating user' });
    },
    onSettled: () => {
      setSubmitting(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Check for duplicate email
    const emailExists = users?.some(
      (user) => user.email.toLowerCase() === formData.email.toLowerCase()
    );
    if (emailExists) {
      toast({
        variant: 'destructive',
        title: 'A user with this email already exists.',
      });
      setSubmitting(false);
      return;
    }

    createUser.mutate({
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...formData,
    });
  };

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className='w-4 h-4 mr-2' />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to the system. Fill in the required information
            below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='space-y-4'>
            <div className='grid flex-1 gap-2'>
              <Label htmlFor='name'>Name *</Label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder='Enter user name'
                required
              />
            </div>
            <div className='grid flex-1 gap-2'>
              <Label htmlFor='email'>Email *</Label>
              <Input
                id='email'
                type='email'
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
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
                setIsCreateDialogOpen(false);
                setFormData({ name: '', email: '' });
              }}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={submitting}>
              {submitting && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
              Create User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
