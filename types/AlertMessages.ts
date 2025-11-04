import type { AlertColorMode } from "./AlertColorMode";

export interface Message {
  id: string;
  title: string;
  mode: AlertColorMode;
  showCloseButton?: boolean;
}
