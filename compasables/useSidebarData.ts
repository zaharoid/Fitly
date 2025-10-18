import { LINK_DASHBOARD } from '~/entries/pageLinks';
import { utilToKebabCase } from '~/utils/text';
import { useLogout } from './useLogout';

export interface NavItem {
  path?: string
  title: string
  icon: string
  disabled?: boolean
  exact?: boolean
  count: number
  action: () => void
  id: number | string
}

function addIdToLinks (links: any[], prefix: String): NavItem[] {
  return links.map((link, index) => ({
    ...link,
    id: `${prefix}-${utilToKebabCase(link.path)}-${index}`,
  }));
}

export const useSidebarData = () => {

  const mainLinks = computed<NavItem[]>(() => {
    const returned = [
      {
        path: LINK_DASHBOARD(),
        title: 'Dashboard',
        icon: 'item-table-list',
        disabled: false,
        exact: true,
        count: 0,
      },
    ];
    return addIdToLinks(returned, 'mainLink');
  });

  const actions = computed<NavItem[]>(() => {
    const returned = [
      {
        title: 'Logout',
        icon: 'action-go-out',
        count: 0,
        action: useLogout(),
      },
    ];
    return addIdToLinks(returned, 'footerLink');
  });

  return { mainLinks, actions };
};
