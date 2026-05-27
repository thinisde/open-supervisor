/**
 * OS Notification Default Constants
 */

import type { NotificationConfig } from "../interfaces/notification-config.js";

export const NOTIFICATION_DEFAULTS: Required<NotificationConfig> = {
    title: "Agent Supervisor",
    message: "Task completed",
    playSound: true,
    soundPath: "",
    maxTrackedSessions: 100,
};
