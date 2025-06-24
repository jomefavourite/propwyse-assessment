'use client';

import type React from 'react';

// import { useState, useEffect } from 'react';
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
import UserTable from '@/components/UserTable';
import { Suspense, useEffect, useState } from 'react';
import AddUserDialog from '@/components/AddUserDialog';
import { API_BASE_URL } from '@/lib/utils';
import { getQueryClient } from './get-query-client';
import { useQuery } from '@tanstack/react-query';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

async function getUsers() {
  const res = await fetch(`${API_BASE_URL}/users`);
  return res.json();
}

export default function UserManagement() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const date = null;

  return (
    <div className='container mx-auto p-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>User Management</h1>
          <p className='text-muted-foreground'>
            Manage your users with full CRUD operations
          </p>
        </div>

        <AddUserDialog />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
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
