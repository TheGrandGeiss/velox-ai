import Onboarding from '@/components/blocks/onboarding/onboarding';
import { auth } from '@/lib/auth';
import { prisma } from '@/prisma';
import { redirect } from 'next/navigation';
// import Image from 'next/image';
// import image from '@/assets/image2.svg';

const page = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const onboardingDataExists = await prisma.profile.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (onboardingDataExists) {
    redirect('/dashboard');
  }

  return (
    <div className='h-screen'>
      <Onboarding />

      {/* <div className=' bg-sky-50 flex flex-col justify-between p-8 px-24 rounded-l-4xl rounded-bl-4xl'>
        <h2 className='text-2xl text-blue-700 font-bold pt-4'>
          Steady AI Planner
        </h2>
        <Image
          src={image}
          alt='onboarding image'
          className='align-center h-full w-full'
        />
      </div> */}
    </div>
  );
};

export default page;
