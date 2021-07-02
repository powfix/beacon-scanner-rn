import { api } from "./api/api";
import messaging from "@react-native-firebase/messaging";
import Emitter from "tiny-emitter";

export const firebaseEmitter = new Emitter();

export class FirebaseMessagingManager {

	static onTokenRefreshListener = undefined;
	static removeNotificationListener = undefined;
	static removeMessageListener = undefined;

	static setListener = () => {
		console.log('FirebaseMessagingManager.setListener()');
		FirebaseMessagingManager.onTokenRefreshListener = messaging().onTokenRefresh((token) => {
			firebaseEmitter.emit('onTokenRefresh', token);
			FirebaseMessagingManager.registerToken().then(() => {});
		});

		// FirebaseMessagingManager.removeNotificationListener = notifications().onNotification((notification: Notification) => {
		// 	console.log('onNotification', notification);
		// 	firebaseEmitter.emit('onNotification', notification);
		//
		// 	const channel = new notifications.Android.Channel("Default", "Default", notifications.Android.Importance.High);
		// 	notifications().android.createChannel(channel).then(() => {});
		//
		// 	let notification_to_be_displayed = new notifications.Notification({
		// 		data: notification.data,
		// 		sound: 'default',
		// 		show_in_foreground: true,
		// 		title: notification.title,
		// 		body: notification.body,
		// 	});
		//
		// 	if (Platform.OS === "android") {
		// 		notification_to_be_displayed
		// 			.android.setPriority(notifications.Android.Priority.High)
		// 			.android.setChannelId("Default")
		// 			.android.setVibrate(1000);
		// 	}
		//
		// 	notifications().displayNotification(notification_to_be_displayed).then(() => {});
		// });

		// Background, Quit 상태일 경우
		messaging().setBackgroundMessageHandler(async (remoteMessage) => {
			//  여기에 로직을 작성한다.
			//  remoteMessage.data로 메세지에 접근가능
			//  remoteMessage.from 으로 topic name 또는 message identifier
			//  remoteMessage.messageId 는 메시지 고유값 id
			//  remoteMessage.notification 메시지와 함께 보내진 추가 데이터
			//  remoteMessage.sentTime 보낸시간
			console.log('BackgroundMessageHandler():remoteMessage', remoteMessage);
		});

		// Foreground 상태인 경우
		FirebaseMessagingManager.removeMessageListener = messaging().onMessage((message) => {
			console.log('onMessage()', message);
			firebaseEmitter.emit('onMessage', message);
		});
	};

	static releaseListener = () => {
		try {
			FirebaseMessagingManager.onTokenRefreshListener();
			FirebaseMessagingManager.removeNotificationListener();
			FirebaseMessagingManager.removeMessageListener();
		} catch (e) {
			console.error(e);
		}
	};

	static registerToken = (): Promise => {
		return new Promise((resolve, reject) => {
			messaging().hasPermission().then((hasPermission) => {
				if (!hasPermission) {
					console.warn('Firebase messaging has no permission');
					messaging().requestPermission().then(() => {
						console.log('Firebase messaging request permission:success');
						FirebaseMessagingManager.registerToken().then(resolve).catch(reject);
					}).catch((error) => {
						console.warn('Firebase messaging request permission:failed');
						reject(error);
					});
					return;
				}

				console.log('Firebase messaging has permission', hasPermission);
				messaging().getToken().then((token) => {
					api.post('/v1/notification/token', {token}).then((response) => {
						if (!response.ok) {
							return reject(response);
						}

						FirebaseMessagingManager.setListener();
						resolve();
					}).catch((error) => {
						console.error('FCM Token not registered(Error)', error);
						return reject(error);
					});
				});
			});
		});
	};

	static unregisterToken = (): Promise => {
		return new Promise((resolve, reject) => {
			messaging().getToken().then((token) => {
				iid().deleteToken().then(() => {
					console.log('firebase.iid().deleteToken().then()');
				});

				api.delete('/v1/fcm-token', {token}).then((response) => {
					if (!response.ok) {
						console.error('Failed to delete FCM Token from server', response);
						return reject(response);
					}

					console.log('Success to delete FCM Token from server', response);
					FirebaseMessagingManager.releaseListener();
					resolve();
				}).catch((error) => {
					console.error('Failed to delete FCM Token from server(Error)', error);
					reject(error);
				})
			});
		});
	};
}