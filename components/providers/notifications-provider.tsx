"use client"

import type { ReactNode } from "react"
import { NotificationsContext, useNotificationsState } from "@/hooks/use-notifications"

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const notificationsState = useNotificationsState()

  return <NotificationsContext.Provider value={notificationsState}>{children}</NotificationsContext.Provider>
}
