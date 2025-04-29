import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import i18n from '../i18n/i18n';

export async function scheduleDailyReminder(hour: number, minute: number) {
  // Ask for permissions
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.log('Notification permissions not granted');
    return;
  }


  // Cancel existing notifications (optional, to prevent duplicates)
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Schedule a daily reminder
  await Notifications.scheduleNotificationAsync({
    content: {
      title: i18n.t('notification.reminderTitle'),
      body: i18n.t('notification.reminder')
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    },
  });
}