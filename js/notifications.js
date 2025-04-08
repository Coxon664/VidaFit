const NotificationManager = {
    async init() {
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return;
        }

        try {
            if (Notification.permission === 'default') {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    await this.setupNotificationButtons();
                }
            } else if (Notification.permission === 'granted') {
                await this.setupNotificationButtons();
            }
        } catch (error) {
            console.error('Error initializing notifications:', error);
        }
    },

    async setupNotificationButtons() {
        const buttons = [
            document.getElementById('enable-notifications'),
            document.getElementById('mobile-enable-notifications')
        ];

        buttons.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', async () => {
                    try {
                        if (Notification.permission === 'default') {
                            const permission = await Notification.requestPermission();
                            if (permission === 'granted') {
                                UI.showNotification('Notifications enabled successfully!', 'info');
                            }
                        } else if (Notification.permission === 'granted') {
                            UI.showNotification('Notifications are already enabled!', 'info');
                        }
                    } catch (error) {
                        console.error('Error setting up notification button:', error);
                        UI.showNotification('Failed to enable notifications', 'error');
                    }
                });
            }
        });
    }
};

window.NotificationManager = NotificationManager;