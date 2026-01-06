export type InfoItem = {
  id: number|string;
  title: string;
  mode?: 'text'|'files'|'cellItemType'|'link';
  tooltip?: { text: string };
  description?: string;
  copiedContent?: string;
  classNames?: string;
  content?: {
    link?: string;
    target?: string;
    title?: string;
    img?: {
      url: string;
      alt: string;
    };
    icon?: string,
    items?: any[];
  },
}

export type DataInfoItem = Omit<InfoItem, 'classNames'> & {view?: 'xl'|'' }
