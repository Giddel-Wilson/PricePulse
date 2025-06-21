import { writable } from 'svelte/store';
import type { Notification } from '$lib/types';
import { generateId } from '$lib/utils';

interface NotificationStore {
	notifications: Notification[];
}

const createNotificationStore = () => {
	const { subscribe, update } = writable<NotificationStore>({ notifications: [] });

	return {
		subscribe,
		
		add: (notification: Omit<Notification, 'id'>) => {
			const id = generateId();
			const newNotification: Notification = {
				id,
				autoHide: true,
				duration: 5000,
				...notification
			};

			update(store => ({
				notifications: [...store.notifications, newNotification]
			}));

			// Auto-hide notification if specified
			if (newNotification.autoHide) {
				setTimeout(() => {
					remove(id);
				}, newNotification.duration);
			}

			return id;
		},

		remove: (id: string) => {
			update(store => ({
				notifications: store.notifications.filter(n => n.id !== id)
			}));
		},

		clear: () => {
			update(() => ({ notifications: [] }));
		},

		// Convenience methods
		success: (message: string, autoHide = true) => {
			return add({ type: 'success', message, autoHide });
		},

		error: (message: string, autoHide = false) => {
			return add({ type: 'error', message, autoHide });
		},

		warning: (message: string, autoHide = true) => {
			return add({ type: 'warning', message, autoHide });
		},

		info: (message: string, autoHide = true) => {
			return add({ type: 'info', message, autoHide });
		}
	};

	function add(notification: Omit<Notification, 'id'>) {
		const id = generateId();
		const newNotification: Notification = {
			id,
			autoHide: true,
			duration: 5000,
			...notification
		};

		update(store => ({
			notifications: [...store.notifications, newNotification]
		}));

		if (newNotification.autoHide) {
			setTimeout(() => {
				remove(id);
			}, newNotification.duration);
		}

		return id;
	}

	function remove(id: string) {
		update(store => ({
			notifications: store.notifications.filter(n => n.id !== id)
		}));
	}
};

export const notifications = createNotificationStore();
