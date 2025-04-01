import { Zap } from "lucide-react"
import { FaDiscord, FaGithub } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

export const Footer=()=>{
    const currentYear = new Date().getFullYear();
    return <footer className="bg-gray-900 text-gray-400 py-12 px-8">
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="text-white font-bold text-xl flex items-center mb-4">
            <Zap className="mr-2" />
            FundRaiser
          </div>
          <p className="mb-4">Decentralized crowdfunding on the Ethereum blockchain.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white transition-colors">
                <FaXTwitter size={20} className="cursor-pointer" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
                <FaDiscord size={20} className="cursor-pointer"/>

            </a>
            <a href="#" className="hover:text-white transition-colors">
                <FaGithub size={20} className="cursor-pointer"/>

            </a>
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-medium mb-4">Platform</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition-colors">Explore</a></li>
            <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Start a Campaign</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Voting System</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-medium mb-4">Resources</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Smart Contracts</a></li>
            <li><a href="#" className="hover:text-white transition-colors">API</a></li>
            <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-medium mb-4">Legal</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-800 mt-12 pt-8 text-center">
        <p>&copy; {currentYear} FundRaiser. All rights reserved.</p>
      </div>
    </div>
  </footer>
}