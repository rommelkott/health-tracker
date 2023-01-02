import React from "react";
import { Session } from "next-auth";
import { ProfileButton } from "./ProfileButton";


interface HeaderProps {
    status: "authenticated" | "loading" | "unauthenticated";
    session: Session | null;
    handleSignIn?: () => void;
    handleSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = (
    {
        status,
        session,
        handleSignIn,
        handleSignOut,
    }
) => {
    return (
        <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center bg-gray-900 p-4">
                <a href="/" className="text-gray-200 font-bold text-2xl">Health Tracker</a>
                <ProfileButton
                    session={session}
                    status={status}
                    handleSignIn={handleSignIn}
                    handleSignOut={handleSignOut}
                />
            </div>
        </div>
    );
};

export default Header;