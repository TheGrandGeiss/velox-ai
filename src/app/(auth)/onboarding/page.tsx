import Onboarding from '@/components/blocks/onboarding/onboarding';
import { auth } from '@/lib/auth';
import { prisma } from '@/prisma';
import { redirect } from 'next/navigation';

const page = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  // const onboardingDataExists = await prisma.profile.findUnique({
  //   where: {
  //     userId: session.user.id,
  //   },
  // });

  // if (onboardingDataExists) {
  //   redirect('/dashboard');
  // }

  return (
    <div className='h-screen'>
      <Onboarding />
    </div>
  );
};

export default page;
