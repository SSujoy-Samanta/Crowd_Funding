"use client";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import Button from "./Buttons/buttons";
import { ProfileModal } from "./ProfileModal";
import { Profile } from "./Profile";


export const AuthButtons = () => {
  const [toggle, setToggle] = useState<boolean>(false);
  const router = useRouter();
  const session = useSession();
  const username = session.data?.user?.name || "unknown";
  const email = session.data?.user?.email || "unknown@gmail.com";
  
  return (
    <div>
      {session.data !== null ? (
        <div className="flex justify-evenly items-center gap-2 text-white">
          <div className="flex gap-2 sm:flex xxs:hidden ">
          </div>
          <div className="">
            <div className="">
              <Profile
                onClick={() => {
                  setToggle((x) => !x);
                }}
                userName={`${username}`}
              />
              {toggle && (
                <ProfileModal
                  username={username}
                  email={email}
                  setToggle={setToggle}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-evenly items-center flex-col md:flex-row gap-2">
            <Button
                label="Sign up"
                variant="purpleHaze"
                onClick={() => {
                    router.push("/signup");
                }}
                className="px-24 md:px-4"
            />
            <Button
                label="Log in"
                variant="steelGray"
                onClick={() => {
                    router.push("/signin");
                }}
                className="px-24 md:px-4"
            />
        </div>
      )}
    </div>
  );
};
