"use client";

import { PersonIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import './profile.css';
import { JSX } from "react";

type ProfileProps = {
    u: {
        username: string;
        displayName: string;
    }
}

export default function Profile({u}: ProfileProps): JSX.Element {
    const router = useRouter();
    return (
        <div
            key={u.username}
            className="profile-card"
            onClick={() => {router.push(`/${u.username}`);}}
        >
            <div className="profile-card-avatar">
            <PersonIcon width={20} height={20} />
            </div>

            <div className="profile-card-text">
            <span className="profile-card-displayname">{u.displayName}</span>
            <span className="profile-card-username">@{u.username}</span>
            </div>
        </div>
    )
}