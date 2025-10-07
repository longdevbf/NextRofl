"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, ShieldCheck, ShieldX, Search, Clock, Users, Activity, AlertTriangle, Grid3X3 } from "lucide-react"

export default function GrantRevokePage() {
  const [activeTab, setActiveTab] = useState("grant")
  const [showNFTSelector, setShowNFTSelector] = useState(false)
  const [selectedNFT, setSelectedNFT] = useState<any>(null)

  const permissions = [
    { id: 1, address: "0x1234...5678", permission: "Mint", status: "Active", timestamp: "2024-01-15" },
    { id: 2, address: "0x9876...4321", permission: "Transfer", status: "Revoked", timestamp: "2024-01-14" },
    { id: 3, address: "0x5555...7777", permission: "Burn", status: "Active", timestamp: "2024-01-13" },
  ]

  const mockNFTs = [
    { id: 1, name: "Secure Data #001", image: "/placeholder.svg?height=100&width=100", tokenId: "001" },
    { id: 2, name: "Privacy Token #042", image: "/placeholder.svg?height=100&width=100", tokenId: "042" },
    { id: 3, name: "Encrypted Asset #123", image: "/placeholder.svg?height=100&width=100", tokenId: "123" },
    { id: 4, name: "Confidential #456", image: "/placeholder.svg?height=100&width=100", tokenId: "456" },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black/80 to-blue-900/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-blue-900/20" />

      <div className="relative z-10 px-4 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm mb-4">
              <Shield className="w-4 h-4" />
              Permission Management
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Grant &{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Revoke
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Manage permissions and access control for your NFTs and smart contracts on Oasis ROFL.
            </p>
          </div>

          <div className="w-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-900/50 border border-purple-500/20 max-w-md mx-auto">
                <TabsTrigger value="grant" className="data-[state=active]:bg-purple-600">
                  Grant Permissions
                </TabsTrigger>
                <TabsTrigger value="revoke" className="data-[state=active]:bg-purple-600">
                  Revoke Permissions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="grant" className="space-y-6 mt-8">
                <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                  {/* Grant Form */}
                  <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-green-400" />
                        Grant Permission
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Grant access permissions to wallet addresses
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-white">Select NFT</Label>
                        <Button
                          variant="outline"
                          className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-800 bg-gray-800/50"
                          onClick={() => setShowNFTSelector(!showNFTSelector)}
                        >
                          <Grid3X3 className="w-4 h-4 mr-2" />
                          {selectedNFT ? selectedNFT.name : "Select NFT"}
                        </Button>

                        {showNFTSelector && (
                          <div className="mt-2 p-4 bg-gray-800/80 border border-gray-700 rounded-lg max-h-64 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-3">
                              {mockNFTs.map((nft) => (
                                <div
                                  key={nft.id}
                                  className="p-3 bg-gray-900/50 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors"
                                  onClick={() => {
                                    setSelectedNFT(nft)
                                    setShowNFTSelector(false)
                                  }}
                                >
                                  <img
                                    src={nft.image || "/placeholder.svg"}
                                    alt={nft.name}
                                    className="w-full aspect-square object-cover rounded mb-2"
                                  />
                                  <p className="text-sm text-white font-medium">{nft.name}</p>
                                  <p className="text-xs text-gray-400">#{nft.tokenId}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="grantAddress" className="text-white">
                          Wallet Address
                        </Label>
                        <Input
                          id="grantAddress"
                          placeholder="0x..."
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="permission" className="text-white">
                          Permission Type
                        </Label>
                        <select className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white">
                          <option value="read">Read Data</option>
                          <option value="transfer">Transfer</option>
                          <option value="modify">Modify</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="duration" className="text-white">
                          Duration (days)
                        </Label>
                        <Input
                          id="duration"
                          type="number"
                          placeholder="30"
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                        />
                      </div>

                      <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 text-lg rounded-full">
                        <ShieldCheck className="w-5 h-5 mr-2" />
                        Grant Permission
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Permission Stats */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-green-400">24</div>
                          <div className="text-sm text-gray-400">Active Permissions</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-red-400">8</div>
                          <div className="text-sm text-gray-400">Revoked Today</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-white text-lg">Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <ShieldCheck className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-white">Read permission granted</span>
                          </div>
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <ShieldX className="w-4 h-4 text-red-400" />
                            <span className="text-sm text-white">Transfer permission revoked</span>
                          </div>
                          <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Revoked</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="revoke" className="space-y-6 mt-8">
                <div className="max-w-6xl mx-auto space-y-6">
                  <div className="grid lg:grid-cols-3 gap-6">
                    <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-white text-lg">Select NFT</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="outline"
                          className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-800 bg-gray-800/50"
                          onClick={() => setShowNFTSelector(!showNFTSelector)}
                        >
                          <Grid3X3 className="w-4 h-4 mr-2" />
                          {selectedNFT ? selectedNFT.name : "Select NFT"}
                        </Button>

                        {showNFTSelector && (
                          <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                            {mockNFTs.map((nft) => (
                              <div
                                key={nft.id}
                                className="flex items-center gap-3 p-2 bg-gray-800/50 rounded cursor-pointer hover:bg-gray-700/50"
                                onClick={() => {
                                  setSelectedNFT(nft)
                                  setShowNFTSelector(false)
                                }}
                              >
                                <img
                                  src={nft.image || "/placeholder.svg"}
                                  alt={nft.name}
                                  className="w-10 h-10 object-cover rounded"
                                />
                                <div>
                                  <p className="text-sm text-white">{nft.name}</p>
                                  <p className="text-xs text-gray-400">#{nft.tokenId}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <div className="lg:col-span-2">
                      {/* Search and Filter */}
                      <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm mb-6">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <div className="flex-1 relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <Input
                                placeholder="Search by address or permission..."
                                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                              />
                            </div>
                            <Button
                              variant="outline"
                              className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                            >
                              Filter
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Permissions List */}
                      <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center gap-2">
                            <ShieldX className="w-5 h-5 text-red-400" />
                            Active Permissions
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            Manage and revoke existing permissions
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {permissions.map((permission) => (
                              <div
                                key={permission.id}
                                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <div className="text-white font-medium">{permission.address}</div>
                                    <div className="text-sm text-gray-400 flex items-center gap-2">
                                      <Clock className="w-3 h-3" />
                                      {permission.timestamp}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                                    {permission.permission}
                                  </Badge>
                                  <Badge
                                    className={
                                      permission.status === "Active"
                                        ? "bg-green-500/20 text-green-300 border-green-500/30"
                                        : "bg-red-500/20 text-red-300 border-red-500/30"
                                    }
                                  >
                                    {permission.status}
                                  </Badge>
                                  {permission.status === "Active" && (
                                    <Button size="sm" variant="destructive" className="bg-red-600 hover:bg-red-700">
                                      Revoke
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-16 grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total Users</span>
                    <span className="text-white font-bold">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Active Permissions</span>
                    <span className="text-green-400 font-bold">892</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Pending Requests</span>
                    <span className="text-yellow-400 font-bold">23</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Revoked Today</span>
                    <span className="text-red-400 font-bold">8</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Permission Types
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                    <span className="text-gray-300">Read Data</span>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">342</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                    <span className="text-gray-300">Transfer</span>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">298</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                    <span className="text-gray-300">Modify</span>
                    <Badge className="bg-red-500/20 text-red-300 border-red-500/30">156</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                    <span className="text-gray-300">Admin</span>
                    <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">96</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    Security Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-yellow-300 text-sm font-medium">Unusual Activity</p>
                    <p className="text-yellow-200 text-xs">3 rapid permission grants detected</p>
                  </div>
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-300 text-sm font-medium">Failed Attempts</p>
                    <p className="text-red-200 text-xs">5 unauthorized access attempts</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 max-w-4xl mx-auto">
              <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-xl text-center">ROFL Permission Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-purple-300">Grant Process</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <h4 className="text-white font-medium">Secure Authorization</h4>
                            <p className="text-gray-400 text-sm">
                              Users provide permissions to others through ROFL's trusted execution environment
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <h4 className="text-white font-medium">Encrypted Access Keys</h4>
                            <p className="text-gray-400 text-sm">
                              Access permissions are encrypted and managed securely within the ROFL runtime
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <h4 className="text-white font-medium">Granular Control</h4>
                            <p className="text-gray-400 text-sm">
                              Set specific permission levels and time-based access controls for enhanced security
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-red-300">Revoke Process</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <h4 className="text-white font-medium">Instant Revocation</h4>
                            <p className="text-gray-400 text-sm">
                              Immediately revoke access permissions through ROFL's secure protocol
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <h4 className="text-white font-medium">Audit Trail</h4>
                            <p className="text-gray-400 text-sm">
                              All permission changes are logged and tracked for security auditing
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <h4 className="text-white font-medium">Zero-Knowledge Verification</h4>
                            <p className="text-gray-400 text-sm">
                              Recipients can access granted data without exposing sensitive information to third parties
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
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
