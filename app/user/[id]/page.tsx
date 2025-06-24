import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { API_BASE_URL } from '@/lib/utils';

const UserPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const userDataRes = await fetch(`${API_BASE_URL}/users/${id}`);

  if (!userDataRes.ok) {
    // User not found or other error
    if (userDataRes.status === 404) {
      return notFound(); // Renders the 404 page
    }

    throw new Error(`Failed to load user: ${userDataRes.status}`);
  }

  const userData = await userDataRes.json();

  return (
    <div className='container mx-auto p-6 space-y-6'>
      <Link href='/'>
        <Button size='sm' variant='ghost'>
          Back
        </Button>
      </Link>

      <h1 className='text-3xl font-bold'>{userData?.name}</h1>
      <p>Email: {userData?.email}</p>

      <Button>Delete User</Button>
    </div>
  );
};

export default UserPage;
