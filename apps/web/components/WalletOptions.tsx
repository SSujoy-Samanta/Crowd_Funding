'use client';
import { useConnect } from 'wagmi'

export function WalletOptions() {
  const { connectors, connect } = useConnect()

  return <div className='flex gap-2 justify-center items-center mt-5'>
    {
      connectors.map((connector) => (
          <button key={connector.uid} onClick={() => connect({ connector })} className='bg-gray-600 p-2 rounded-md '>
          {connector.name}
          </button>
      ))
    }
  </div>
  
}