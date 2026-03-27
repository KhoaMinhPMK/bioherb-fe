import React, { useMemo, useCallback } from 'react';
import { BellOff, CheckCheck } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import './Notifications.scss';

const TYPE_ICONS = {
    task: '📋',
    pest: '🐛',
    harvest: '🌾',
    system: '⚙️',
    approval: '✅',
};

const Notifications = () => {
    const { notifications, markNotificationRead, markAllNotificationsRead, unreadNotifCount } = useData();
    const { addToast } = useToast();

    const sorted = useMemo(() => {
        return [...notifications].sort((a, b) => {
            if (a.read !== b.read) return a.read ? 1 : -1;
            return 0;
        });
    }, [notifications]);

    const handleMarkAll = useCallback(() => {
        markAllNotificationsRead();
        addToast('Đã đánh dấu tất cả đã đọc', 'success');
    }, [markAllNotificationsRead, addToast]);

    return (
        <div className="page-container">
            <PageHeader
                title="Thông báo"
                subtitle={`${unreadNotifCount} thông báo chưa đọc`}
                actions={
                    unreadNotifCount > 0 ? (
                        <button className="btn btn--outline" onClick={handleMarkAll}>
                            <CheckCheck size={16} /> Đã đọc tất cả
                        </button>
                    ) : null
                }
            />

            <div className="notifications-list">
                {sorted.length === 0 && (
                    <div className="notifications-empty card">
                        <BellOff size={40} />
                        <p>Không có thông báo nào</p>
                    </div>
                )}
                {sorted.map((notif) => (
                    <div
                        key={notif.id}
                        className={`notification-item card ${notif.read ? 'notification-item--read' : 'notification-item--unread'}`}
                        onClick={() => {
                            if (!notif.read) markNotificationRead(notif.id);
                        }}
                    >
                        <div className="notification-item__icon">
                            <span>{TYPE_ICONS[notif.type] || '📌'}</span>
                        </div>
                        <div className="notification-item__body">
                            <p className="notification-item__message">{notif.message}</p>
                            <span className="notification-item__time">{notif.time || notif.date || '—'}</span>
                        </div>
                        {!notif.read && <div className="notification-item__dot" />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
