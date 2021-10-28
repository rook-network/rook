import React from 'react';

export interface Notification {
    title: string;
    message?: string;
    icon?: HTMLImageElement;
}

export interface NotificationPanelProps {
    notifications: Notification[]
}

export class NotificationPanel extends React.Component {
    render() {
        return (
            <div>
                Hello World
            </div>
        )
    }
}