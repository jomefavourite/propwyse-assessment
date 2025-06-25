'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import DeleteUserDialog from '@/components/DeleteUserDialog';
import { API_BASE_URL } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

const fetchUser = async (id: string): Promise<User> => {
  const res = await fetch(`${API_BASE_URL}/users/${id}`);

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('NOT_FOUND');
    }
    throw new Error(`Failed to load user: ${res.status}`);
  }

  return res.json();
};

export default function UserPage() {
  const params = useParams();
  const id = params?.id as string;

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
    enabled: !!id,
  });

  if (error instanceof Error && error.message === 'NOT_FOUND') {
    notFound();
  }

  if (isLoading) {
    return <div className='p-6'>Loading user...</div>;
  }

  if (!userData) {
    return <div className='p-6 text-red-500'>User not found.</div>;
  }

  return (
    <div className='container mx-auto p-6 space-y-6'>
      <Link href='/'>
        <Button size='sm' variant='outline'>
          Back
        </Button>
      </Link>
      <h1 className='text-3xl font-bold'>{userData.name}</h1>
      <p>Email: {userData.email}</p>

      <DeleteUserDialog user={userData}>
        <Button>Delete User</Button>
      </DeleteUserDialog>
    </div>
  );
}
