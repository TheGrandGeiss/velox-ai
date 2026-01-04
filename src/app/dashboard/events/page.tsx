import EventList from '@/components/blocks/Events/events';
import { fetchEvents } from '@/lib/actions/events';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

const page = async () => {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }
  const data = await fetchEvents();
  return (
    <>
      <EventList events={data} />
    </>
  );
};

export default page;
