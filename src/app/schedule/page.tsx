import ScheduleHome from '@/components/blocks/schedule/home';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

const page = async () => {
  const session = await auth();

  // If user is not logged in, redirect to home
  if (!session) {
    redirect('/');
  }

  return (
    <>
      <ScheduleHome />
    </>
  );
};

export default page;
