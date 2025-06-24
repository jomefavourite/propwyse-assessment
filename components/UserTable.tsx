'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, Trash2, Mail, User } from 'lucide-react';
import Link from 'next/link';
import EditUserDialog from './EditUserDialog';
import AddUserDialog from './AddUserDialog';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

type UserTableType = {
  users: User[];
  loading: boolean;
};

export default function UserTable({ users, loading }: UserTableType) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>A list of all users in the system</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='w-8 h-8 animate-spin' />
            <span className='ml-2'>Loading users...</span>
          </div>
        ) : users.length === 0 ? (
          <div className='text-center py-8'>
            <div className='w-12 h-12 mx-auto text-muted-foreground mb-4'>
              <User />
            </div>
            <h3 className='text-lg font-semibold mb-2'>No users found</h3>
            <p className='text-muted-foreground mb-4'>
              Get started by creating your first user
            </p>

            <AddUserDialog />
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className='font-medium'>
                      <Link href={`user/${user.id}`}>
                        <div className='flex items-center'>
                          <div className='w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3'>
                            <User />
                          </div>
                          {user.name}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center'>
                        <Mail className='w-4 h-4 mr-2 text-muted-foreground' />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell className='text-right'>
                      <div className='flex items-center justify-end space-x-2'>
                        <EditUserDialog user={user} />

                        <Button
                          variant='outline'
                          size='sm'
                          // onClick={() => deleteUser(user.id)}
                          className='text-destructive hover:text-destructive'
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
