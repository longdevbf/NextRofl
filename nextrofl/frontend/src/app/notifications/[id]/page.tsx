"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Share2, Copy, Eye, Download, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function NotificationDetailPage() {
  const params = useParams()
  const [isMarkedRead, setIsMarkedRead] = useState(false)

  // Mock notification data - in real app, fetch by ID
  const notification = {
    id: Number.parseInt(params.id as string),
    type: "data_share",
    title: "Data Shared",
    message:
      "Alice shared encrypted data from NFT #1234 with you. This includes confidential business documents with AES-256 encryption.",
    fullContent:
      "Alice has shared access to NFT #1234 containing confidential business merger documents. The data includes financial projections, legal contracts, and strategic planning documents. All data is encrypted using AES-256 encryption and requires your private key for decryption. This sharing permission will expire in 30 days unless renewed.",
    timestamp: "2 minutes ago",
    isRead: false,
    icon: Share2,
    sender: {
      name: "Alice Johnson",
      address: "0x1234567890abcdef1234567890abcdef12345678",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    priority: "high",
    nftDetails: {
      id: "#1234",
      name: "Confidential Merger Documents",
      dataType: "Legal Documents",
      encryptionLevel: "AES-256",
      size: "4.2 MB",
      permissions: ["read", "download"],
      expiresAt: "2024-02-20",
    },
    actions: [
      { type: "view", label: "View NFT Data", icon: Eye },
      { type: "download", label: "Download Files", icon: Download },
      { type: "share", label: "Share Access", icon: Share2 },
    ],
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const markAsRead = () => {
    setIsMarkedRead(true)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black/80 to-blue-900/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-blue-900/20" />

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/notifications">
            <Button variant="outline" className="mb-6 border-gray-600 text-gray-300 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Notifications
            </Button>
          </Link>

          {/* Notification Header */}
          <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-full bg-blue-500/20 text-blue-400">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white mb-2">{notification.title}</CardTitle>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span>{notification.timestamp}</span>
                      <Badge
                        className={`${
                          notification.priority === "high"
                            ? "bg-red-500/20 text-red-400 border-red-500/30"
                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        }`}
                      >
                        {notification.priority} priority
                      </Badge>
                      {!notification.isRead && !isMarkedRead && (
                        <Badge className="bg-purple-500 text-white">Unread</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {!notification.isRead && !isMarkedRead && (
                  <Button
                    onClick={markAsRead}
                    variant="outline"
                    className="border-purple-500/30 text-purple-400 bg-transparent"
                  >
                    Mark as Read
                  </Button>
                )}
              </div>
            </CardHeader>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Message Content */}
              <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Message Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed mb-4">{notification.fullContent}</p>

                  {notification.priority === "high" && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <span className="text-red-400 text-sm">
                        This is a high priority notification requiring immediate attention.
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* NFT Details */}
              <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Shared NFT Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-1">NFT ID</h4>
                      <p className="text-white">{notification.nftDetails.id}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-1">Data Type</h4>
                      <p className="text-white">{notification.nftDetails.dataType}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-1">Encryption</h4>
                      <Badge className="bg-green-500/20 text-green-400">
                        {notification.nftDetails.encryptionLevel}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-1">File Size</h4>
                      <p className="text-white">{notification.nftDetails.size}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-1">Access Expires</h4>
                      <p className="text-white">{notification.nftDetails.expiresAt}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-1">Permissions</h4>
                      <div className="flex gap-1">
                        {notification.nftDetails.permissions.map((perm) => (
                          <Badge key={perm} className="bg-purple-500/20 text-purple-400 text-xs">
                            {perm}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {notification.actions.map((action) => {
                      const IconComponent = action.icon
                      return (
                        <Button
                          key={action.type}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 justify-start"
                        >
                          <IconComponent className="w-4 h-4 mr-2" />
                          {action.label}
                        </Button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Sender Info */}
              <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg">From</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={notification.sender.avatar || "/placeholder.svg"}
                        alt={notification.sender.name}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                        {notification.sender.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-white font-semibold">{notification.sender.name}</h3>
                      <p className="text-gray-400 text-sm">Verified User</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Wallet Address</h4>
                    <div className="flex items-center space-x-2">
                      <code className="text-green-400 text-xs bg-gray-800 p-2 rounded flex-1">
                        {notification.sender.address.slice(0, 10)}...{notification.sender.address.slice(-8)}
                      </code>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(notification.sender.address)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Info */}
              <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Encryption</span>
                    <Badge className="bg-green-500/20 text-green-400">Verified</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Sender Identity</span>
                    <Badge className="bg-green-500/20 text-green-400">Verified</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Data Integrity</span>
                    <Badge className="bg-green-500/20 text-green-400">Verified</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
