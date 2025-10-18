import type { Image } from '~t/Image';
import type { Session } from 'next-auth'

type User = {
  title: string;
  description: string;
  image: Image;
}
export function userMapper(data: Session['user']): User {
  console.log('data', data);
  
  return {
    title: data?.name || '',
    description: data?.email || '',
    image: { 
      url: data?.image || '',
      alt: 'Profile image'
     }
  }
}