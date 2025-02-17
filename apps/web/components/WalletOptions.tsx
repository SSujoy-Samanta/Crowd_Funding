'use client';

import { useConnect } from 'wagmi';
import Button, { VariantType } from './Buttons/buttons';

const variants: VariantType[] = [
  
  "secondary",
  "blueOcean",
  "sunsetGlow",
  "emeraldShine",
  "purpleHaze",
  "steelGray",
  "fieryRed",
  "aquaBreeze",
  "goldenGlow",
  "connect",
  "primary",
  "danger",
  "success",
  "outline",
  "link", 
];

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  return (
    <div className="flex gap-2 justify-center items-center flex-col mt-5">
      {connectors.map((connector, index) => (
        <Button
          key={connector.id || connector.uid} // Use `id` as fallback if `uid` is undefined
          onClick={() => connect({ connector })}
          label={connector.name}
          variant={variants[index] || "connect"} 
          size='large'
          className='w-full'
        />
      ))}
    </div>
  );
}
