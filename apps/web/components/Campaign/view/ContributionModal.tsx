import { ethers } from "ethers";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { BiSolidDonateHeart } from "react-icons/bi";
import { TimeAgo } from "./TimeAgo";

interface Contributors {
  walletAddress: string;
  amount: string;
  timestamp:Date;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  contributors: Contributors[];
}

const ContributorsModal: React.FC<ModalProps> = ({ isOpen, onClose, contributors }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Modal Animation */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">All Contributors</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={20} />
          </button>
        </div>

        {/* Contributors List */}
        <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
          {contributors.length === 0 ? (
            <p className="text-center text-gray-500">No contributors yet.</p>
          ) : (
            <ul className="space-y-3">
              {contributors.map((contributor, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                  <div className="flex justify-start items-center gap-2">
                    <div className="p-2 rounded-full bg-slate-200 flex justify-center items-center w-12 h-12">
                        <BiSolidDonateHeart size={20} className="text-black"/>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-sm text-gray-700">{contributor.walletAddress.slice(0,5)+"..."+contributor.walletAddress.slice(-5)}</span>
                      <span className="font-semibold text-gray-900">{ethers.formatEther(contributor.amount)} ETH</span>
                    </div>
                  </div>
                  <div className="text-gray-500 flex justify-end items-center">
                    <TimeAgo timestamp={contributor.timestamp}/>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ContributorsModal;
