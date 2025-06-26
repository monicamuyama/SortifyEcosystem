"use client"

import { useState } from "react"
import { Bell, X, Check, Info, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNotifications } from "@/hooks/use-notifications"

export function NotificationCenter() {
  const { notifications = [], markAsRead, clearAll, unreadCount = 0 } = useNotifications()
  const [open, setOpen] = useState(false)

  // Filter notifications by type
  const systemNotifications = notifications.filter((n) => n.type === "system")
  const activityNotifications = notifications.filter((n) => n.type === "activity")
  const rewardNotifications = notifications.filter((n) => n.type === "reward")

  const getIcon = (type: string, variant: string) => {
    if (variant === "success") return <Check className="h-4 w-4 text-green-500" />
    if (variant === "warning") return <AlertTriangle className="h-4 w-4 text-amber-500" />
    if (variant === "error") return <X className="h-4 w-4 text-red-500" />
    return <Info className="h-4 w-4 text-blue-500" />
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle>Notifications</SheetTitle>
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear all
            </Button>
          </div>
        </SheetHeader>

        <Tabs defaultValue="all" className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-4 mx-4 mt-2">
            <TabsTrigger value="all">
              All
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto p-4">
            <TabsContent value="all" className="space-y-2 mt-0">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${notification.read ? "bg-background" : "bg-muted/50"}`}
                  >
                    <div className="flex">
                      <div className="mr-3 mt-0.5">{getIcon(notification.type, notification.variant)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 h-7 text-xs"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="system" className="space-y-2 mt-0">
              {systemNotifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No system notifications</p>
                </div>
              ) : (
                systemNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${notification.read ? "bg-background" : "bg-muted/50"}`}
                  >
                    <div className="flex">
                      <div className="mr-3 mt-0.5">{getIcon(notification.type, notification.variant)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 h-7 text-xs"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-2 mt-0">
              {activityNotifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No activity notifications</p>
                </div>
              ) : (
                activityNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${notification.read ? "bg-background" : "bg-muted/50"}`}
                  >
                    <div className="flex">
                      <div className="mr-3 mt-0.5">{getIcon(notification.type, notification.variant)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 h-7 text-xs"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="rewards" className="space-y-2 mt-0">
              {rewardNotifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No reward notifications</p>
                </div>
              ) : (
                rewardNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${notification.read ? "bg-background" : "bg-muted/50"}`}
                  >
                    <div className="flex">
                      <div className="mr-3 mt-0.5">{getIcon(notification.type, notification.variant)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 h-7 text-xs"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
