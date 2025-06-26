// "use client"

import { useState, createContext, useContext } from "react"

export type Notification = {
  id: string
  title: string
  message: string
  type: "system" | "activity" | "reward"
  variant: "info" | "success" | "warning" | "error"
  read: boolean
  time: string
}

type NotificationsContextType = {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "read" | "time">) => void
  markAsRead: (id: string) => void
  clearAll: () => void
  unreadCount: number
}

// Create the context with a default value
export const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  addNotification: () => {},
  markAsRead: () => {},
  clearAll: () => {},
  unreadCount: 0,
})

// Hook to use the notifications context
export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}

// This is a client-side only hook to manage notifications state
export function useNotificationsState() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Welcome to Sortify",
      message: "Thank you for joining our smart waste management platform!",
      type: "system",
      variant: "info",
      read: false,
      time: "Just now",
    },
    {
      id: "2",
      title: "Smart Bin Update",
      message: "New smart bins have been installed in your area.",
      type: "system",
      variant: "info",
      read: false,
      time: "2 hours ago",
    },
    {
      id: "3",
      title: "Collection Scheduled",
      message: "Your waste collection has been scheduled for tomorrow.",
      type: "activity",
      variant: "success",
      read: false,
      time: "Yesterday",
    },
    {
      id: "4",
      title: "Tokens Earned",
      message: "You've earned 25 tokens for your recent recycling activity!",
      type: "reward",
      variant: "success",
      read: false,
      time: "3 days ago",
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const addNotification = (notification: Omit<Notification, "id" | "read" | "time">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      time: "Just now",
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const clearAll = () => {
    setNotifications([])
  }

  return {
    notifications,
    addNotification,
    markAsRead,
    clearAll,
    unreadCount,
  }
}
