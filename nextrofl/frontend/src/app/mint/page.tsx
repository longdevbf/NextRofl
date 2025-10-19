"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Upload, Sparkles, Zap, CheckCircle, XCircle, Image as ImageIcon, Loader2 } from "lucide-react"
import { useWallet } from "@/context/walletContext"
import { 
  mintNFT, 
  uploadImageToIPFS, 
  createAndUploadMetadata,
  type MintNFTResponse 
} from "@/lib/rofl-mint-api"
import Image from "next/image"

export default function MintPage() {
  const [nftName, setNftName] = useState("")
  const [description, setDescription] = useState("")
  const [recipient, setRecipient] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isUploadingMetadata, setIsUploadingMetadata] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [mintResult, setMintResult] = useState<MintNFTResponse | null>(null)
  const [uploadProgress, setUploadProgress] = useState<string>("")
  const { isConnected, address } = useWallet()

  useEffect(() => {
    if (isConnected && address && !recipient) {
      setRecipient(address ?? "")
    }
  }, [isConnected, address, recipient])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`)
      return
    }

    // Validate file size (100MB)
    const maxSize = 100 * 1024 * 1024
    if (file.size > maxSize) {
      alert('File too large. Maximum size: 100MB')
      return
    }

    setImageFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleMint = async () => {
    if (!nftName || !description || !recipient) {
      alert("Please fill in all required fields")
      return
    }

    if (!imageFile) {
      alert("Please upload an image")
      return
    }

    setIsMinting(true)
    setMintResult(null)
    setUploadProgress("")

    try {
      // Step 1: Upload image to IPFS
      setUploadProgress("Uploading image to IPFS...")
      setIsUploadingImage(true)
      const imageResult = await uploadImageToIPFS(imageFile)
      console.log('Image uploaded to IPFS:', imageResult.ipfsUrl)
      setIsUploadingImage(false)

      // Step 2: Create and upload metadata to IPFS
      setUploadProgress("Creating and uploading metadata to IPFS...")
      setIsUploadingMetadata(true)
      const metadataUri = await createAndUploadMetadata(
        nftName,
        description,
        imageResult.ipfsUrl
      )
      console.log('Metadata uploaded to IPFS:', metadataUri)
      setIsUploadingMetadata(false)

      // Step 3: Mint NFT via ROFL
      setUploadProgress("Minting NFT via ROFL...")
      const result = await mintNFT({
        recipient,
        metadataUri
      })

      setMintResult(result)
      setUploadProgress("")

      if (result.status === 'success') {
        // Reset form on success
        setNftName("")
        setDescription("")
        setImageFile(null)
        setImagePreview("")
      }

    } catch (error) {
      console.error('Mint error:', error)
      setMintResult({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      })
      setUploadProgress("")
    } finally {
      setIsMinting(false)
      setIsUploadingImage(false)
      setIsUploadingMetadata(false)
    }
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
              ROFL NFT Minting Platform
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Mint Your{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Encrypted NFT
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Create unique digital assets on Oasis Sapphire with ROFL security and encrypted metadata.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Main Content - Form */}
            <div>
              <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Mint Encrypted NFT</CardTitle>
                  <CardDescription className="text-gray-400">
                    Fill in the details and upload image to mint your encrypted NFT via ROFL
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="image" className="text-white">
                      NFT Image *
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="image"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleImageChange}
                        className="bg-gray-800 border-gray-700 text-white file:bg-purple-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-md file:cursor-pointer"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Supported: JPG, PNG, GIF, WEBP (Max 100MB)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                      NFT Name *
                    </Label>
                    <Input
                      id="name"
                      value={nftName}
                      onChange={(e) => setNftName(e.target.value)}
                      placeholder="Enter NFT name"
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your NFT"
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 min-h-[120px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipient" className="text-white">
                      Recipient Address *
                    </Label>
                    <Input
                      id="recipient"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="0x..."
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                    />
                    {isConnected && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setRecipient(address ?? "")}
                        className="text-xs text-purple-400 border-purple-500/30"
                      >
                        Use Connected Wallet
                      </Button>
                    )}
                  </div>

                  {/* Upload Progress */}
                  {uploadProgress && (
                    <div className="p-4 rounded-lg border border-blue-500/30 bg-blue-900/20">
                      <div className="flex items-center gap-2 text-blue-300">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">{uploadProgress}</span>
                      </div>
                    </div>
                  )}

                  {/* Mint Result Display */}
                  {mintResult && (
                    <div className={`p-4 rounded-lg border ${
                      mintResult.status === 'success' 
                        ? 'bg-green-900/20 border-green-500/30 text-green-300'
                        : mintResult.status === 'error'
                        ? 'bg-red-900/20 border-red-500/30 text-red-300'
                        : 'bg-blue-900/20 border-blue-500/30 text-blue-300'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {mintResult.status === 'success' && <CheckCircle className="w-5 h-5" />}
                        {mintResult.status === 'error' && <XCircle className="w-5 h-5" />}
                        <span className="font-medium">
                          {mintResult.status === 'success' ? 'Mint Successful!' : 
                           mintResult.status === 'error' ? 'Mint Failed' : 'Processing...'}
                        </span>
                      </div>
                      {mintResult.txHash && (
                        <p className="text-sm font-mono break-all">
                          Tx Hash: {mintResult.txHash}
                        </p>
                      )}
                      {mintResult.message && (
                        <p className="text-sm">{mintResult.message}</p>
                      )}
                    </div>
                  )}

                  <Button
                    onClick={handleMint}
                    disabled={isMinting || !nftName || !description || !recipient || !imageFile}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-lg rounded-full disabled:opacity-50"
                  >
                    {isMinting ? (
                      <>
                        <Zap className="w-5 h-5 mr-2 animate-spin" />
                        {isUploadingImage ? 'Uploading Image...' : 
                         isUploadingMetadata ? 'Uploading Metadata...' : 
                         'Minting via ROFL...'}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Mint Encrypted NFT
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Preview Section */}
            <div className="space-y-6">
              <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-6 overflow-hidden">
                    {imagePreview ? (
                      <Image 
                        src={imagePreview} 
                        alt="NFT Preview" 
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-gray-500">
                        <ImageIcon className="w-24 h-24" />
                        <p className="text-sm">Upload an image to preview</p>
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {nftName || "NFT Name"}
                  </h3>
                  <p className="text-gray-400 mb-6 text-lg">
                    {description || "Description will appear here..."}
                  </p>
                  <div className="flex justify-between items-center mb-6">
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-lg px-4 py-2">
                      Encrypted
                    </Badge>
                    <Badge variant="outline" className="border-gray-600 text-gray-400 text-lg px-4 py-2">
                      {mintResult?.status === 'success' ? 'Minted' : 'Draft'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* ROFL Process Info */}
              <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg">ROFL Security Process</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-white font-medium">IPFS Upload</h4>
                      <p className="text-gray-400 text-sm">
                        Image and metadata are uploaded to IPFS via Pinata for decentralized storage
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-white font-medium">ROFL Processing</h4>
                      <p className="text-gray-400 text-sm">
                        ROFL processes your mint request in a trusted execution environment
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-white font-medium">Contract Interaction</h4>
                      <p className="text-gray-400 text-sm">
                        ROFL signs and submits the mintNFT transaction to Sapphire contract
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