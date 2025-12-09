"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../AuthWrapper";
import Link from 'next/link';
import {
  RocketIcon,
  MagnifyingGlassIcon,
  PersonIcon,
  GearIcon,
  ExitIcon,
  EnterIcon
} from "@radix-ui/react-icons";
import "./sidebar.css";

export default function Sidebar() {
  const [showSearch, setShowSearch] = useState(false);
  const router = useRouter();

  const searchRef = useRef<HTMLDivElement | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false);
      }
    }
    if (showSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearch]);

  return (
    <div style={{ display: "flex" }}>
      <aside className="sidebar">
        <div className="sidebar-top">
          <Link href="/" aria-label="Explore" title="Explore" className="sidebar-link explore">
            <RocketIcon width={22} height={22} />
          </Link>

          <button
            aria-label="Search"
            title="Search"
            onClick={() => setShowSearch((s) => !s)}
            className="sidebar-link search"
          >
            <MagnifyingGlassIcon width={20} height={20} />
          </button>
        </div>

        <div className="sidebar-bottom">
          {user !== null ? ( <> <button
            aria-label="Open profile"
            title="Profile"
            onClick={() => router.push(`/${user?.username}`)}
            className="sidebar-button profile"
          >
            <PersonIcon width={22} height={22} />
          </button>

          <button
            aria-label="Logout"
            title="Logout"
            onClick={() => {
              document.cookie = "sessionId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
              window.location.href = "/login";
            }}
            className="sidebar-button logout"
          >
            <ExitIcon width={20} height={20} />
          </button> </> ) : ( <>
            <button
            aria-label="Login"
            title="Login"
            onClick={() => {
              document.cookie = "sessionId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
              window.location.href = "/login";
            }}
            className="sidebar-button login"
          >
            <EnterIcon width={20} height={20} />
          </button>
          </> )}
        </div>
      </aside>
      {showSearch && (
        <div className="search-panel" ref={searchRef}>
          <h2>Search</h2>
          <input
            type="text"
            placeholder="Search for people..."
            className="search-input"
          />
        </div>
      )}
      </div>
  );
}
