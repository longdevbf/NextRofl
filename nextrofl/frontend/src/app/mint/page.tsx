"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Upload, Sparkles, Zap } from "lucide-react"
import { useWallet } from "@/context/walletContext"
export default function MintPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const { isConnected, address, disconnect } = useWallet()
  const handleMint = async () => {
    setIsMinting(true)
    // Simulate minting process
    setTimeout(() => {
      setIsMinting(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black/80 to-blue-900/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-blue-900/20" />

      <div className="relative z-10 px-4 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              NFT Minting Platform
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Mint Your{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                NFT
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Create unique digital assets on the Oasis ROFL blockchain with our advanced minting platform.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Main Content - Form */}
            <div>
              <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Create NFT</CardTitle>
                  <CardDescription className="text-gray-400">
                    Fill in the details to mint your unique NFT
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                      NFT Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter NFT name"
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your NFT"
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 min-h-[120px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="encryptionKey" className="text-white">
                      Encryption Key
                    </Label>
                    <Input
                      id="encryptionKey"
                      type="text"
                      placeholder="Enter encryption key"
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Upload Image</Label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center hover:border-purple-500/50 transition-colors cursor-pointer">
                      <Upload className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400 mb-2">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>

                  <Button
                    onClick={handleMint}
                    disabled={isMinting}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-lg rounded-full"
                  >
                    {isMinting ? (
                      <>
                        <Zap className="w-5 h-5 mr-2 animate-spin" />
                        Minting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Mint NFT
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                    <Upload className="w-24 h-24 text-gray-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">NFT Name</h3>
                  <p className="text-gray-400 mb-6 text-lg">Description will appear here...</p>
                  <div className="flex justify-between items-center mb-6">
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-lg px-4 py-2">
                      Encrypted
                    </Badge>
                    <Badge variant="outline" className="border-gray-600 text-gray-400 text-lg px-4 py-2">
                      Draft
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Stats moved to bottom of preview section */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">1,234</div>
                    <div className="text-sm text-gray-400">Total Minted</div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">0.05</div>
                    <div className="text-sm text-gray-400">Gas Fee</div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">98.5%</div>
                    <div className="text-sm text-gray-400">Success Rate</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg">ROFL Security Process</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-white font-medium">Data Encryption</h4>
                      <p className="text-gray-400 text-sm">
                        Your NFT data is encrypted using advanced cryptographic algorithms before processing
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-white font-medium">ROFL Processing</h4>
                      <p className="text-gray-400 text-sm">
                        Oasis ROFL (Runtime OFfchain Logic) securely processes your encrypted data in a trusted
                        execution environment
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-white font-medium">IPFS Storage</h4>
                      <p className="text-gray-400 text-sm">
                        Processed data is stored on IPFS (InterPlanetary File System) ensuring decentralized and
                        permanent availability
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
