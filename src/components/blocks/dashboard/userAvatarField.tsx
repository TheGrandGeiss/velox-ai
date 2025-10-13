import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function UserAvatarField() {
  const session = await auth();
  console.log(session?.user?.image);

  if (!session?.user?.image) {
    redirect('/sign-up');
  }
  return (
    <div className='flex w-full max-w-lg flex-col gap-6'>
      <Item variant='muted'>
        <ItemMedia>
          <Avatar className='size-10'>
            <AvatarImage src={session.user.image} />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{session.user.name}</ItemTitle>
          <ItemDescription>{session.user.email}</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  );
}
