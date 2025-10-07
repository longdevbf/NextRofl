"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {User, Bell, LogOut } from "lucide-react"
import NotificationPanel from "./notification-panel"
import { ConnectWallet } from "@/components/ConnectWallet"
import { useWallet } from "@/context/walletContext"
export default function Header() {
  const { isConnected, address, disconnect } = useWallet()
  const [showNotifications, setShowNotifications] = useState(false)


  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-purple-500/20 bg-gradient-to-br from-purple-900/10 via-black/80 to-blue-900/10 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">OR</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Oasis ROFL
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/mint" className="text-gray-300 hover:text-purple-400 transition-colors font-medium">
              Mint NFT
            </Link>
            <Link href="/grant-revoke" className="text-gray-300 hover:text-purple-400 transition-colors font-medium">
              Grant/Revoke
            </Link>
            <Link href="/nft-data" className="text-gray-300 hover:text-purple-400 transition-colors font-medium">
              Update
            </Link>
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {!isConnected ? (
              <div className="hidden md:flex">
                <ConnectWallet />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 border-2 border-purple-500/30">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                          {address?.slice(2, 4).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="text-sm font-medium text-white">Wallet Address</p>
                        <p className="text-xs text-gray-400">{address?.substring(0, 6)}...{address?.substring(address.length - 4)}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem asChild className="text-gray-300 hover:text-white hover:bg-gray-800">
                      <Link href="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        View Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowNotifications(true)}
                      className="text-gray-300 hover:text-white hover:bg-gray-800"
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem
                      onClick={disconnect}
                      className="text-red-400 hover:text-red-300 hover:bg-gray-800"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Disconnect
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </header>
      <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </>
  )
}
