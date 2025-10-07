"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Share2, Shield, Clock, CheckCircle, Trash2, Archive, Bell } from "lucide-react"
import Link from "next/link"

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const notifications = [
    {
      id: 1,
      type: "data_share",
      title: "Data Shared",
      message:
        "Alice shared encrypted data from NFT #1234 with you. This includes confidential business documents with AES-256 encryption.",
      timestamp: "2 minutes ago",
      isRead: false,
      icon: Share2,
      sender: "Alice (0x1234...5678)",
      priority: "high",
    },
    {
      id: 2,
      type: "permission_granted",
      title: "Permission Granted",
      message: "You've been granted read access to NFT #5678 containing medical records. Access expires in 30 days.",
      timestamp: "1 hour ago",
      isRead: false,
      icon: Shield,
      sender: "Dr. Smith (0x9876...4321)",
      priority: "medium",
    },
    {
      id: 3,
      type: "data_request",
      title: "Data Access Request",
      message: "Bob requested access to your NFT #9012 data containing financial reports. Please review and approve.",
      timestamp: "3 hours ago",
      isRead: true,
      icon: Clock,
      sender: "Bob (0x5555...7777)",
      priority: "medium",
    },
    {
      id: 4,
      type: "permission_revoked",
      title: "Permission Revoked",
      message: "Access to NFT #3456 has been revoked due to security policy update. Contact admin for details.",
      timestamp: "1 day ago",
      isRead: true,
      icon: CheckCircle,
      sender: "System",
      priority: "low",
    },
    {
      id: 5,
      type: "data_share",
      title: "New Data Received",
      message: "Charlie shared legal contract NFT #7890 with you. Contains sensitive merger documents.",
      timestamp: "2 days ago",
      isRead: true,
      icon: Share2,
      sender: "Charlie (0xabcd...efgh)",
      priority: "high",
    },
  ]

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unread" && !notification.isRead) ||
      (activeTab === "read" && notification.isRead)
    return matchesSearch && matchesTab
  })

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black/80 to-blue-900/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-blue-900/20" />

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm mb-4">
              <Bell className="w-4 h-4" />
              Notification Center
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Your{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Notifications
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Stay updated with data sharing, permissions, and security alerts from your Oasis ROFL network.
            </p>
          </div>

          {/* Search and Actions */}
          <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                    <Archive className="w-4 h-4 mr-2" />
                    Archive All
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Read
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 border border-purple-500/20 mb-6">
              <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">
                All ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread" className="data-[state=active]:bg-purple-600">
                Unread ({notifications.filter((n) => !n.isRead).length})
              </TabsTrigger>
              <TabsTrigger value="read" className="data-[state=active]:bg-purple-600">
                Read ({notifications.filter((n) => n.isRead).length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredNotifications.map((notification) => {
                const IconComponent = notification.icon
                return (
                  <Link key={notification.id} href={`/notifications/${notification.id}`}>
                    <Card
                      className={`bg-gray-900/50 border-purple-500/20 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-300 cursor-pointer ${
                        !notification.isRead ? "ring-1 ring-purple-500/30" : ""
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div
                            className={`p-3 rounded-full ${
                              notification.type === "data_share"
                                ? "bg-blue-500/20 text-blue-400"
                                : notification.type === "permission_granted"
                                  ? "bg-green-500/20 text-green-400"
                                  : notification.type === "data_request"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            <IconComponent className="w-5 h-5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-semibold text-white">{notification.title}</h3>
                              <div className="flex items-center gap-2">
                                {!notification.isRead && <Badge className="bg-purple-500 text-white">New</Badge>}
                                <Badge
                                  className={`${
                                    notification.priority === "high"
                                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                                      : notification.priority === "medium"
                                        ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                        : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                                  }`}
                                >
                                  {notification.priority}
                                </Badge>
                              </div>
                            </div>

                            <p className="text-gray-300 mb-3 leading-relaxed">{notification.message}</p>

                            <div className="flex items-center justify-between text-sm">
                              <span className="text-purple-400">From: {notification.sender}</span>
                              <span className="text-gray-500">{notification.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}

              {filteredNotifications.length === 0 && (
                <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <Bell className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No notifications found</h3>
                    <p className="text-gray-400">
                      {searchQuery ? "Try adjusting your search terms" : "You're all caught up!"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
