import type { Image } from '~t/Image';
import type { AlertColorMode } from './AlertColorMode';

export type Notification = {
  id: string;
  title: string;
  description: string;
  actionBtn?: {
    title: string;
    action: string;
  },
  illustration?: {
    image?: Image;
    fallback?: { type: 'title'; }
      | { type: 'icon'; iconName: string; className?: string; };
    title?: string;
  },
  badge?: {
    label: string;
    mode: AlertColorMode;
  };
  subDescription?: string;
  accurateDate?: string;
  isHighlight?: boolean;
}

export type NotificationGroup = {
  id: string;
  title: string;
  items: Notification[];
}
