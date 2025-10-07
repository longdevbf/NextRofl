import Link from "next/link"
import { Github, Twitter, Diamond as Discord } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-purple-500/20 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">OR</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Oasis ROFL
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs">
              Experience the future of blockchain technology with Oasis ROFL - secure, scalable, and innovative.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/mint" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Mint NFT
                </Link>
              </li>
              <li>
                <Link href="/grant-revoke" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Grant/Revoke
                </Link>
              </li>
              <li>
                <Link href="/nft-data" className="text-gray-400 hover:text-purple-400 transition-colors">
                  NFT Explorer
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Connect</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Discord className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-purple-500/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 Oasis ROFL. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
