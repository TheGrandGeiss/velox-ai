import Onboarding from '@/components/blocks/onboarding/onboarding';
import { getOnboardingData } from '@/lib/actions/getOnboardingData';
import { auth } from '@/lib/auth';

import { redirect } from 'next/navigation';

const page = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const onboardingDataExists = await getOnboardingData(session);

  if (onboardingDataExists) {
    redirect('/dashboard');
  }

  return (
    <div className='h-screen'>
      <Onboarding />
    </div>
  );
};

export default page;
