"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Database, Copy, MapPin, Calendar, Users } from "lucide-react"

export default function ProfilePage() {
  const [selectedNFT, setSelectedNFT] = useState<any>(null)
  const [showData, setShowData] = useState(false)

  const userNFTs = [
    {
      id: 1,
      name: "Secure Document #1234",
      image: "/placeholder.svg?height=200&width=200",
      description: "Confidential business contract with encrypted metadata",
      dataType: "Legal Document",
      encryptionLevel: "AES-256",
      accessLevel: "Private",
      createdAt: "2024-01-15",
      dataSize: "2.4 MB",
      permissions: ["read", "share"],
      secureData: {
        documentHash: "0xa1b2c3d4e5f6789012345678901234567890abcdef",
        encryptedContent: "U2FsdGVkX1+vupppZksvRf5pq5g5XjFRIipRkwB0K1Y=",
        accessLog: [
          { user: "0x1234...5678", action: "read", timestamp: "2024-01-20 10:30" },
          { user: "0xabcd...efgh", action: "granted", timestamp: "2024-01-19 15:45" },
        ],
      },
    },
    {
      id: 2,
      name: "Medical Record #5678",
      image: "/placeholder.svg?height=200&width=200",
      description: "Personal health data with privacy protection",
      dataType: "Medical Record",
      encryptionLevel: "AES-256",
      accessLevel: "Restricted",
      createdAt: "2024-01-10",
      dataSize: "1.8 MB",
      permissions: ["read"],
      secureData: {
        documentHash: "0xb2c3d4e5f6789012345678901234567890abcdef12",
        encryptedContent: "U2FsdGVkX1+abc123def456ghi789jkl012mno345pqr=",
        accessLog: [{ user: "0x5678...9012", action: "read", timestamp: "2024-01-18 14:20" }],
      },
    },
    {
      id: 3,
      name: "Financial Report #9012",
      image: "/placeholder.svg?height=200&width=200",
      description: "Quarterly financial statements with audit trail",
      dataType: "Financial Data",
      encryptionLevel: "AES-256",
      accessLevel: "Confidential",
      createdAt: "2024-01-05",
      dataSize: "3.2 MB",
      permissions: ["read", "share", "audit"],
      secureData: {
        documentHash: "0xc3d4e5f6789012345678901234567890abcdef1234",
        encryptedContent: "U2FsdGVkX1+xyz789abc012def345ghi678jkl901mno=",
        accessLog: [
          { user: "0x9012...3456", action: "audit", timestamp: "2024-01-16 09:15" },
          { user: "0xdef0...1234", action: "read", timestamp: "2024-01-14 16:30" },
        ],
      },
    },
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black/80 to-blue-900/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-blue-900/20" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Profile Info */}
          <div className="lg:w-1/3">
            <div className="sticky top-8">
              <div className="space-y-6">
                <div className="text-center">
                  <Avatar className="h-32 w-32 mx-auto mb-4 border-4 border-purple-500/30">
                    <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Profile" />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-3xl">
                      OR
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-2xl font-bold text-white mb-2">Oasis User</h1>
                  <p className="text-gray-400 text-sm mb-3">Blockchain Security Specialist</p>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Connected</Badge>
                </div>

                <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center text-gray-300 text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                        Oasis Network
                      </div>
                      <div className="flex items-center text-gray-300 text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                        Joined January 2024
                      </div>
                      <div className="flex items-center text-gray-300 text-sm">
                        <Users className="w-4 h-4 mr-2 text-purple-400" />
                        12 connections
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <h3 className="text-white font-semibold mb-3">Wallet Address</h3>
                      <div className="flex items-center space-x-2">
                        <code className="text-green-400 text-xs bg-gray-800 p-2 rounded flex-1">0x1234...5678</code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard("0x1234567890abcdef1234567890abcdef12345678")}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <h3 className="text-white font-semibold mb-3">Stats</h3>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-purple-400">3</div>
                          <div className="text-xs text-gray-400">NFTs Owned</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-400">7</div>
                          <div className="text-xs text-gray-400">Data Shares</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Right Content - NFT Collection */}
          <div className="lg:w-2/3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">My Secure NFTs</h2>
              <p className="text-gray-400">Manage your encrypted data assets and permissions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userNFTs.map((nft) => (
                <Card
                  key={nft.id}
                  className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300"
                >
                  <CardHeader className="pb-3">
                    <img
                      src={nft.image || "/placeholder.svg"}
                      alt={nft.name}
                      className="w-full aspect-square object-cover rounded-lg mb-3"
                    />
                    <CardTitle className="text-white text-lg">{nft.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm mb-4">{nft.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white">{nft.dataType}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Encryption:</span>
                        <Badge className="bg-green-500/20 text-green-400 text-xs">{nft.encryptionLevel}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Access:</span>
                        <Badge className="bg-purple-500/20 text-purple-400 text-xs">{nft.accessLevel}</Badge>
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                          onClick={() => setSelectedNFT(nft)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900 border-purple-500/20 max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-white text-xl">{selectedNFT?.name}</DialogTitle>
                        </DialogHeader>

                        {selectedNFT && (
                          <div className="space-y-6">
                            <img
                              src={selectedNFT.image || "/placeholder.svg"}
                              alt={selectedNFT.name}
                              className="w-full aspect-square object-cover rounded-lg"
                            />

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h3 className="text-white font-semibold mb-2">NFT Information</h3>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Data Type:</span>
                                    <span className="text-white">{selectedNFT.dataType}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Size:</span>
                                    <span className="text-white">{selectedNFT.dataSize}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Created:</span>
                                    <span className="text-white">{selectedNFT.createdAt}</span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h3 className="text-white font-semibold mb-2">Security</h3>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Encryption:</span>
                                    <Badge className="bg-green-500/20 text-green-400 text-xs">
                                      {selectedNFT.encryptionLevel}
                                    </Badge>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Access Level:</span>
                                    <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                                      {selectedNFT.accessLevel}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div>
                              <Button
                                onClick={() => setShowData(!showData)}
                                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 mb-4"
                              >
                                <Database className="w-4 h-4 mr-2" />
                                {showData ? "Hide Data" : "Read Data"}
                              </Button>

                              {showData && (
                                <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                                  <div>
                                    <h4 className="text-white font-semibold mb-2">Document Hash</h4>
                                    <div className="flex items-center space-x-2">
                                      <code className="text-green-400 text-xs bg-gray-900 p-2 rounded flex-1">
                                        {selectedNFT.secureData.documentHash}
                                      </code>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => copyToClipboard(selectedNFT.secureData.documentHash)}
                                      >
                                        <Copy className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="text-white font-semibold mb-2">Encrypted Content</h4>
                                    <div className="flex items-center space-x-2">
                                      <code className="text-blue-400 text-xs bg-gray-900 p-2 rounded flex-1">
                                        {selectedNFT.secureData.encryptedContent}
                                      </code>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => copyToClipboard(selectedNFT.secureData.encryptedContent)}
                                      >
                                        <Copy className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="text-white font-semibold mb-2">Access Log</h4>
                                    <div className="space-y-2">
                                      {selectedNFT.secureData.accessLog.map((log: any, index: number) => (
                                        <div
                                          key={index}
                                          className="flex items-center justify-between bg-gray-900 p-2 rounded text-xs"
                                        >
                                          <span className="text-gray-400">{log.user}</span>
                                          <Badge className="bg-blue-500/20 text-blue-400">{log.action}</Badge>
                                          <span className="text-gray-500">{log.timestamp}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
