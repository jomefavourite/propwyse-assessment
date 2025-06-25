'use client';

import React, { useState, useMemo } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Mail, User } from 'lucide-react';
import Link from 'next/link';
import EditUserDialog from './EditUserDialog';
import AddUserDialog from './AddUserDialog';
import DeleteUserDialog from './DeleteUserDialog';
import { Input } from './ui/input';

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
  users: User[] | undefined;
  loading: boolean;
};

export default function UserTable({ users, loading }: UserTableType) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'recent'>('all');

  // Filter and search logic
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    let filtered = users;

    // Filter: show only users created in the last 7 days if "recent" is selected
    if (filter === 'recent') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filtered = filtered.filter(
        (user) => new Date(user.createdAt) >= sevenDaysAgo
      );
    }

    // Search by name or email
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [users, search, filter]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>A list of all users in the system</CardDescription>
        <div className='flex flex-col md:flex-row md:items-center gap-2 mt-4'>
          <Input
            className='w-full '
            type='text'
            placeholder='Search by name or email'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select>
            <SelectTrigger
              className='w-[180px]'
              value={filter}
              onChange={(e) =>
                setFilter(
                  (e.target as HTMLSelectElement).value as 'all' | 'recent'
                )
              }
            >
              <SelectValue placeholder='All Users' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Users</SelectItem>
              <SelectItem value='recent'>Created in Last 7 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='w-8 h-8 animate-spin' />
            <span className='ml-2'>Loading users...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className='text-center py-8'>
            <div className='w-12 h-12 mx-auto text-muted-foreground mb-4'>
              <User />
            </div>
            <h3 className='text-lg font-semibold mb-2'>No users found</h3>
            <p className='text-muted-foreground mb-4'>
              Get started by creating your first user
            </p>

            <AddUserDialog users={users} />
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
                {filteredUsers.map((user) => (
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
                        <DeleteUserDialog user={user} />
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
