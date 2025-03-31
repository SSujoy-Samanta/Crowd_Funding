"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CiCreditCard1 } from "react-icons/ci";
import { IoMail, IoWallet } from "react-icons/io5";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { useSession } from "next-auth/react";
import { useAccount, useBalance } from "wagmi";
import { WalletPopUp } from "./WalletPopUp";
import Button from "./Buttons/buttons";
import { GoPerson } from "react-icons/go";
import ChangePasswordForm from "./ChangePassword";


export const ProfileCard = () => {
  const [edit,setEdit]=useState<boolean>(false);
  const { address, isConnected } = useAccount();
  const {data}=useSession();
  const balance = useBalance({address});

  //@ts-ignore
  if(!data?.user && !data?.user?.id){
    return<p className="text-center text-gray-500">Loading profile...</p>;
  }

  return (
    <motion.div
      className="max-w-2xl mx-auto mt-10 p-6 bg-slate-700 shadow-lg rounded-xl"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-black bg-opacity-40 border-none">
        <CardHeader className="relative flex justify-center items-center flex-col text-center bg-gradient-to-br from-pink-500 via-blue-500 to-teal-500 h-36 rounded-md border-none ">
         <div className="absolute -bottom-16 flex justify-center items-center flex-col text-center">
            <div className="flex justify-center items-center rounded-full bg-gradient-to-br from-amber-400 to-pink-500 p-7 ">
              <GoPerson size={34} className="text-black"/>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-500 via-rose-500 to-sky-500 text-transparent bg-clip-text">{data.user.name}</CardTitle>
            {/* <p className="text-sm text-blue-800">Web3FundMe User</p> */}
         </div>
        </CardHeader>

        <CardContent className="mt-14">
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center space-x-3">
              <IoMail className="text-amber-600" size={20} />
              <p className=" text-white">{data.user.email}</p>
            </div>

            {/* Wallet Address */}
            {isConnected && address && <div className="flex items-center space-x-3">
              <IoWallet className="text-amber-800" size={20} />
              <p className="text-white"><span className="font-bold text-amber-600">Address: </span>{address}</p>
            </div>}

            {/* Wallet Balance */}
            {isConnected && <div className="flex items-center space-x-3">
              <CiCreditCard1 className="text-cyan-500" size={20} />
              <p className="text-white"><span className="font-bold text-teal-500">Balance: </span>{balance.data?.formatted || "0.00"} ETH</p>
            </div>}

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-4">
              <WalletPopUp/>
              <Button label="Edit Profile" onClick={()=>{setEdit(x=>!x)}} variant="primary"/>
            </div>
            {
              edit && <div className="absolute top-32 w-2/6 ">
                {
                  //@ts-ignore
                  <ChangePasswordForm setEdit={setEdit} userId={Number(data.user.id)}/>
                }
              </div>
            }
          </div>
        </CardContent>
      </Card>
      
    </motion.div>
  );
};


