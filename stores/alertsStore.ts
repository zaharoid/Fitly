import { defineStore } from 'pinia';
import type { Message } from '~t/AlertMessages';
import type { Notification } from '~t/AlertNotifications';

type AddedNotification = Omit<Notification, 'id'> & { id?: string; closeDuration?: number | null; }
type AddedMessage = Omit<Message, 'id'> & { id?: string; closeDuration?: number | null; }
type AddedItem = AddedNotification|AddedMessage;

type RequiredInItem = {
  id: string;
  closeDuration: number | null;
  closeTimer: number | null;
}
type NotificationItem = Notification & RequiredInItem;
type MessageItem = Message & RequiredInItem;

export const useAlertsStore = defineStore('alertsStore', () => {
  const alertGroups = reactive({
    notification: {
      isTimerRun: true,
      items: [] as NotificationItem[],
    },
    message: {
      isTimerRun: true,
      items: [] as MessageItem[],
    },
  });

  let closeTimer: NodeJS.Timeout|null = null;

  function startCloseTimer () {
    if (closeTimer) return;
    const intervalPeriod = 100;
    closeTimer = setInterval(() => {
      Object.values(alertGroups).forEach((group) => {
        if (!group.isTimerRun) return;
        group.items.forEach((item) => {
          if (typeof item.closeTimer !== 'number') return;
          item.closeTimer -= intervalPeriod;
          if (item.closeTimer <= 0) removeItem(item.id, group.items);
        });
      });
    }, intervalPeriod);
  }

  function stopCloseTimer () {
    if (!closeTimer) return;
    clearInterval(closeTimer);
    closeTimer = null;
  }

  function checkCloseTimer () {
    const needTimer = Object.values(alertGroups)
      .some(group => (group.isTimerRun && group.items.length));

    needTimer ? startCloseTimer() : stopCloseTimer();
  }

  function addItem<T extends AddedItem> (item: T, collection: (T & RequiredInItem)[]) {
    const { closeDuration = 3000 } = item;
    const newItem = {
      id: Date.now().toString(),
      closeDuration,
      closeTimer: closeDuration,
      ...item,
    };
    collection.push(newItem);
    checkCloseTimer();
  }

  function removeItem (id: string, collection: (RequiredInItem & { [key: string]: any })[]) {
    const index = collection.findIndex(item => item.id === id);
    if (index === -1) return;
    collection.splice(index, 1);
    checkCloseTimer();
  }

  function addNotification (item: AddedNotification) {
    addItem<AddedNotification>(item, alertGroups.notification.items);
  }
  function removeNotification (id: string) {
    removeItem(id, alertGroups.notification.items);
  }

  const addMessage = (message: AddedMessage) => {
    addItem<AddedMessage>(message, alertGroups.message.items);
  };

  const removeMessage = (id: string) => {
    removeItem(id, alertGroups.message.items);
  };

  function toggleTimerNotification (val: boolean) {
    if (alertGroups.notification.isTimerRun === val) return;
    alertGroups.notification.isTimerRun = val;
    checkCloseTimer();
  }

  function toggleTimerMessage (val: boolean) {
    if (alertGroups.message.isTimerRun === val) return;
    alertGroups.message.isTimerRun = val;
    checkCloseTimer();
  }

  return {
    notifications: computed(() => alertGroups.notification.items),
    messages: computed(() => alertGroups.message.items),
    addNotification,
    removeNotification,
    toggleTimerNotification,
    addMessage,
    removeMessage,
    toggleTimerMessage,
  };
});
