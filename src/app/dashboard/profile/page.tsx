import ProfilePage from '@/components/blocks/profile/profile';
import { auth } from '@/lib/auth';
import { prisma } from '@/prisma';
// Rename your previous client component to this

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id) return null;

  // 1. Fetch User Data
  const userData = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      accounts: true, // 👈 Get linked accounts
      profile: true, // 👈 Get profile data
    },
  });

  if (!userData) {
    return;
  }

  // 2. Check if Google is linked
  const isGoogleLinked =
    userData?.accounts.some((account) => account.provider === 'google') ||
    false;

  // 3. Prepare initial data for the form
  const initialData = userData?.profile
    ? {
        ...userData.profile,
        // ensure dates are strings if needed by your component
        dob: userData.profile.dob?.toISOString() || '',
        createdAt: userData.profile.createdAt.toISOString(),
        updatedAt: userData.profile.updatedAt.toISOString(),
        // handle other fields mapping
      }
    : null;

  return (
    <ProfilePage
      initialData={initialData}
      isGoogleLinked={isGoogleLinked} // 👈 Pass this down
    />
  );
}
