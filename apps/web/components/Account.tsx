"use client";
import { useState } from "react";
import { useAccount, useBalance, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";

export function Account() {
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const { data: ensName } = useEnsName({ address });
    const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

    // const [isDisconnecting, setIsDisconnecting] = useState(false);

    const balance = useBalance({
        address
    })

    // const handleDisconnect = async () => {
    //     setIsDisconnecting(true);
    //     try {
    //         disconnect();
    //     } finally {
    //         setIsDisconnecting(false);
    //     }
    // };

  return (
        <div className="flex justify-center items-center gap-3">
            {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} className="w-8 h-8 rounded-full" />}
            
            {address && <div className="flex flex-col gap-2">
                <p className="text-fuchsia-800">Your address - {address}</p>
                <p className="text-yellow-500 font-bold"> Your balance - {balance.data?.formatted}</p>
            </div>}

            {/* <button
                onClick={handleDisconnect}
                disabled={!isConnected || isDisconnecting}
                className={`rounded-md px-4 py-2 text-white transition 
                    ${isDisconnecting ? "bg-gray-400 cursor-not-allowed" : isConnected ? "bg-red-600 hover:bg-red-700 active:bg-red-800" : "cursor-not-allowed bg-red-600 hover:bg-red-700 active:bg-red-800"}
                `}
            >
                {isDisconnecting ? "Disconnecting..." : "Disconnect"}
            </button> */}
        </div>
  );
}
