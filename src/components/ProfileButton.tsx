import { Session } from "next-auth";
import React, { Component } from "react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface ProfileButtonProps {
  status: "authenticated" | "loading" | "unauthenticated";
  session: Session | null;
  handleSignIn?: () => void;
  handleSignOut?: () => void;
}

export const ProfileButton: React.FC<ProfileButtonProps> = ({
  status,
  session,
  handleSignIn,
  handleSignOut,
}) => {
  return (
    <>
      <div className="flex items-center gap-2">
        {status === "authenticated" && session && (
          <>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="flex items-center gap-2">
                <img
                  className="h-10 w-10 rounded-full select-none"
                  src={session.user?.image || ""}
                  alt="profile"
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content
                sideOffset={5}
                className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                align="end"
              >
                <div className="py-1">
                  <DropdownMenu.Item
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onSelect={() => (window.location.href = "/u/" + session.user?.id)}
                  >
                    Your Profile
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onSelect={() => (window.location.href = "/settings")}
                  >
                    Account Settings
                  </DropdownMenu.Item>
                  <DropdownMenu.Item

                    className="block px-4 py-2 text-sm text-red-700 hover:bg-red-100"
                    onSelect={handleSignOut}
                  >
                    Sign out
                  </DropdownMenu.Item>
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
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
