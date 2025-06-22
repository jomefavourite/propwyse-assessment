'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';

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

const API_BASE_URL = 'http://localhost:3001';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<UserInput>({ name: '', email: '' });

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/users`);

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      // toast({
      //   title: 'Error',
      //   description: errorMessage,
      //   variant: 'destructive',
      // });
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      // toast({
      //   title: 'Validation Error',
      //   description: 'Please fill in all required fields',
      //   variant: 'destructive',
      // });
      return;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className='container mx-auto p-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>User Management</h1>
          <p className='text-muted-foreground'>
            Manage your users with full CRUD operations
          </p>
        </div>
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
                <div>
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
                <div>
                  <Label htmlFor='email'>Email *</Label>
                  <Input
                    id='email'
                    type='email'
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
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
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
            <User />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Last Updated</CardTitle>
            <Calendar className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-sm text-muted-foreground'>
              {/* {new Date().toLocaleTimeString()} */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
