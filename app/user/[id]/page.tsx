import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { API_BASE_URL } from '@/lib/utils';
import DeleteUserDialog from '@/components/DeleteUserDialog';

const UserPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const userDataRes = await fetch(`${API_BASE_URL}/users/${id}`);

  if (!userDataRes.ok) {
    if (userDataRes.status === 404) return notFound();
    throw new Error(`Failed to load user: ${userDataRes.status}`);
  }

  const userData = await userDataRes.json();

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
};

export default UserPage;
