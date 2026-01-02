import ScheduleHome from '@/components/blocks/chat/home';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

const page = async () => {
  const session = await auth();

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
