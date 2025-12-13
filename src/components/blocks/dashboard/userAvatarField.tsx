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
    <div className=' w-full max-w-lg gap-6'>
      <Item
        variant='default'
        className='flex justify-between items-center'>
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
