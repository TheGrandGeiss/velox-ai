import ProfilePage from '@/components/blocks/profile/profile';
import { getUserProfile } from '@/lib/actions/profileAction';
import React from 'react';

const page = async () => {
  const data = await getUserProfile();
  return (
    <>
      <ProfilePage initialData={data} />
    </>
  );
};

export default page;
