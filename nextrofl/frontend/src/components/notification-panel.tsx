"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Share2, Shield, Clock } from "lucide-react"
import Link from "next/link"

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  const [notifications] = useState([
    {
      id: 1,
      type: "data_share",
      title: "Data Shared",
      message: "Alice shared encrypted data from NFT #1234 with you",
      timestamp: "2 minutes ago",
      isRead: false,
      icon: Share2,
    },
    {
      id: 2,
      type: "permission_granted",
      title: "Permission Granted",
      message: "You've been granted read access to NFT #5678",
      timestamp: "1 hour ago",
      isRead: false,
      icon: Shield,
    },
    {
      id: 3,
      type: "data_request",
      title: "Data Access Request",
      message: "Bob requested access to your NFT #9012 data",
      timestamp: "3 hours ago",
      isRead: true,
      icon: Clock,
    },
  ])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={panelRef}
      className="fixed top-16 right-4 z-50 w-80 max-h-[500px] bg-gray-900/95 backdrop-blur-sm border border-purple-500/20 rounded-lg shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Notifications</h2>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto max-h-[300px]">
        {notifications.map((notification) => {
          const IconComponent = notification.icon
          return (
            <Link key={notification.id} href={`/notifications/${notification.id}`}>
              <div
                className={`p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer ${
                  !notification.isRead ? "bg-purple-500/5" : ""
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-full ${
                      notification.type === "data_share"
                        ? "bg-blue-500/20 text-blue-400"
                        : notification.type === "permission_granted"
                          ? "bg-green-500/20 text-green-400"
                          : notification.type === "data_request"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-white truncate">{notification.title}</h3>
                      {!notification.isRead && <Badge className="bg-purple-500 text-white text-xs ml-2">New</Badge>}
                    </div>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{notification.timestamp}</p>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 space-y-2">
        <Link href="/notifications">
          <Button
            variant="outline"
            className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10 bg-transparent mb-2"
          >
            View All
          </Button>
        </Link>
        <Button variant="outline" className="w-full border-gray-600 text-gray-400 hover:bg-gray-800 bg-transparent">
          Mark All as Read
        </Button>
      </div>
    </div>
  )
}
