import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-3xl font-bold'>User not found</h1>
      <p>We couldn't find the user you're looking for.</p>

      <Link href={'/'} className='pt-4 underline'>
        Go back home
      </Link>
    </div>
  );
}
