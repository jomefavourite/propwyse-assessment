'use client';

import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User } from 'lucide-react';
import UserTable from '@/components/UserTable';
import AddUserDialog from '@/components/AddUserDialog';
import { API_BASE_URL } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

const getUsers: () => Promise<User[]> = async () => {
  const res = await fetch(`${API_BASE_URL}/users`);
  return res.json();
};

export default function UserManagement() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const date = useMemo(() => {
    if (!data || data.length === 0) return '---';

    const latest = new Date(
      Math.max(...data?.map((user) => new Date(user.createdAt).getTime()))
    );

    return latest.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [data]);

  return (
    <div className='container mx-auto p-6 space-y-6'>
      <div className='flex md:items-center justify-between flex-col md:flex-row gap-4'>
        <div>
          <h1 className='text-3xl font-bold'>User Management</h1>
          <p className='text-muted-foreground'>
            Manage your users with full CRUD operations
          </p>
        </div>

        <AddUserDialog users={data} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
            <User />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{data?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Last Updated</CardTitle>
            <Calendar className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-sm text-muted-foreground'>{date}</div>
          </CardContent>
        </Card>
      </div>

      <UserTable users={data} loading={isLoading} />
    </div>
  );
}
