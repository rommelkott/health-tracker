import { Session } from "next-auth";
import React, { Component } from "react";

interface ProfileButtonProps {
  status: "authenticated" | "loading" | "unauthenticated";
  session: Session | null;
  handleSignIn?: () => void;
}

export const ProfileButton: React.FC<ProfileButtonProps> = ({
  status,
  session,
  handleSignIn,
}) => {
  return (
    <>
      <div className="flex items-center gap-2">
        {status === "authenticated" && session && (
          <>
            <div className="flex items-center gap-2">
              <img
                className="h-10 w-10 rounded-full"
                src={session.user?.image || ""}
                alt="profile"
              />
              <span className="text-lg font-bold text-black">
                {session.user?.name || "User"}
              </span>
            </div>
          </>
        )}
        {status === "unauthenticated" && (
          <>
            <div className="flex items-center gap-2">
              <span
                className="cursor-pointer text-lg font-normal text-black"
                onClick={handleSignIn}
              >
                Sign in
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
};
