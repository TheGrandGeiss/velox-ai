import ScheduleHome from '@/components/blocks/chat/home';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

const page = async () => {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/');
  }

  return (
    <>
      <ScheduleHome session={session} />
    </>
  );
};

export default page;
