"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit } from "lucide-react"

export default function UpdatePage() {
  const [selectedNFT, setSelectedNFT] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    encryptionKey: "",
    attributes: "",
  })

  const userNFTs = [
    {
      id: "1",
      name: "Cosmic Warrior #001",
      image: "/placeholder.svg?height=300&width=300",
      owner: "0x1234...5678",
      encryptionKey: "AES256-GCM-KEY-001",
      rarity: "Legendary",
      description: "A legendary cosmic warrior with quantum armor and plasma sword.",
      attributes: "Background: Nebula, Armor: Quantum, Weapon: Plasma Sword",
    },
    {
      id: "2",
      name: "Digital Phoenix #042",
      image: "/placeholder.svg?height=300&width=300",
      owner: "0x1234...5678",
      encryptionKey: "RSA2048-KEY-042",
      rarity: "Epic",
      description: "A majestic digital phoenix with ethereal wings and golden eyes.",
      attributes: "Element: Fire, Wings: Ethereal, Eyes: Golden",
    },
    {
      id: "3",
      name: "Cyber Dragon #123",
      image: "/placeholder.svg?height=300&width=300",
      owner: "0x1234...5678",
      encryptionKey: "ECDSA-P256-KEY-123",
      rarity: "Mythic",
      description: "A powerful cyber dragon with neon scales and electric breath.",
      attributes: "Type: Dragon, Element: Electric, Scales: Neon",
    },
  ]

  const selectedNFTData = userNFTs.find((nft) => nft.id === selectedNFT)

  const handleNFTSelect = (nftId: string) => {
    setSelectedNFT(nftId)
    const nft = userNFTs.find((n) => n.id === nftId)
    if (nft) {
      setFormData({
        name: nft.name,
        description: nft.description,
        encryptionKey: nft.encryptionKey,
        attributes: nft.attributes,
      })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleUpdate = () => {
    console.log("Updating NFT:", selectedNFT, formData)
    // Handle update logic here
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black/80 to-blue-900/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-blue-900/20" />

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm mb-4">
              <Edit className="w-4 h-4" />
              NFT Updater
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Update{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                NFT
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Select and update your NFT metadata, pricing, and attributes on the Oasis ROFL blockchain.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Update Form */}
            <div className="space-y-6">
              <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Update NFT Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* NFT Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="nft-select" className="text-white">
                      Select NFT to Update
                    </Label>
                    <Select value={selectedNFT} onValueChange={handleNFTSelect}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Choose an NFT from your collection" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {userNFTs.map((nft) => (
                          <SelectItem key={nft.id} value={nft.id} className="text-white hover:bg-gray-700">
                            <div className="flex items-center gap-3">
                              <img
                                src={nft.image || "/placeholder.svg"}
                                alt={nft.name}
                                className="w-8 h-8 rounded object-cover"
                              />
                              <div>
                                <div className="font-medium">{nft.name}</div>
                                <div className="text-sm text-gray-400">{nft.rarity}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedNFT && (
                    <>
                      {/* Name */}
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">
                          NFT Name
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                          placeholder="Enter NFT name"
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-white">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 min-h-[100px]"
                          placeholder="Describe your NFT"
                        />
                      </div>

                      {/* Encryption Key */}
                      <div className="space-y-2">
                        <Label htmlFor="encryptionKey" className="text-white">
                          Encryption Key
                        </Label>
                        <Input
                          id="encryptionKey"
                          value={formData.encryptionKey}
                          onChange={(e) => handleInputChange("encryptionKey", e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                          placeholder="Enter encryption key"
                        />
                      </div>

                      {/* Attributes */}
                      <div className="space-y-2">
                        <Label htmlFor="attributes" className="text-white">
                          Attributes
                        </Label>
                        <Textarea
                          id="attributes"
                          value={formData.attributes}
                          onChange={(e) => handleInputChange("attributes", e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                          placeholder="Background: Space, Rarity: Legendary, Power: 95"
                        />
                      </div>

                      {/* Update Button */}
                      <Button
                        onClick={handleUpdate}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Update NFT
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Preview */}
            <div className="space-y-6">
              {selectedNFTData && (
                <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl">Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* NFT Image */}
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-800">
                        <img
                          src={selectedNFTData.image || "/placeholder.svg"}
                          alt={formData.name || selectedNFTData.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* NFT Details */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">
                            {formData.name || selectedNFTData.name}
                          </h3>
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                            {selectedNFTData.rarity}
                          </Badge>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">Description</h4>
                          <p className="text-gray-300">{formData.description || selectedNFTData.description}</p>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">Encryption Key</h4>
                          <p className="text-lg font-mono text-green-400 bg-gray-800/50 p-2 rounded">
                            {formData.encryptionKey || selectedNFTData.encryptionKey}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">Attributes</h4>
                          <p className="text-gray-300">{formData.attributes || selectedNFTData.attributes}</p>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">Owner</h4>
                          <p className="text-gray-300 font-mono">{selectedNFTData.owner}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!selectedNFT && (
                <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Edit className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Select an NFT</h3>
                    <p className="text-gray-400">
                      Choose an NFT from your collection to see the preview and start updating.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* ROFL Security Process description */}
              <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg">ROFL Update Process</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-white font-medium">Secure Re-encryption</h4>
                      <p className="text-gray-400 text-sm">
                        Updated NFT data is re-encrypted with new encryption keys to maintain security integrity
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-white font-medium">ROFL Validation</h4>
                      <p className="text-gray-400 text-sm">
                        Oasis ROFL validates and processes the updated metadata in a trusted execution environment
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-white font-medium">IPFS Update</h4>
                      <p className="text-gray-400 text-sm">
                        Updated data is stored on IPFS with new hash references while maintaining version history
                      </p>
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
