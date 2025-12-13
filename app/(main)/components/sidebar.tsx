"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../AuthWrapper";
import { config } from "../../config";
import Link from "next/link";
import {
  RocketIcon,
  MagnifyingGlassIcon,
  PersonIcon,
  ExitIcon,
  EnterIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import Profile from "./profile";
import "./sidebar.css";

export default function Sidebar() {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [typingTimeout, setTypingTimeout] = useState<any>(null);

  const router = useRouter();
  const searchRef = useRef<HTMLDivElement | null>(null);

  const { user } = useAuth();

  // Close search box when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
        setQuery("");
        setResults([]);
      }
    }
    if (showSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearch]);

  // Debounce search (wait 500ms after typing stops)
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`${config.api_url}/search?query=${query}`);
        if (!res.ok) return;

        const data = await res.json();
        setResults(data.users || []);
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 500);

    setTypingTimeout(timeout);
  }, [query]);

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
          {user ? (
            <>
              <button
                aria-label="Create Post"
                title="Create Post"
                onClick={() => router.push(`/${user.username}?postbox=true`)}
                className="sidebar-button create-post"
              >
                <PlusIcon width={22} height={22} />
              </button>

              <button
                aria-label="Open profile"
                title="Profile"
                onClick={() => router.push(`/${user.username}`)}
                className="sidebar-button profile"
              >
                <PersonIcon width={22} height={22} />
              </button>

              <button
                aria-label="Logout"
                title="Logout"
                onClick={() => {
                  document.cookie = `sessionId=; domain=${config.api_parent_domain}; SameSite=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
                  window.location.href = "/login";
                }}
                className="sidebar-button logout"
              >
                <ExitIcon width={20} height={20} />
              </button>
            </>
          ) : (
            <>
              <button
                aria-label="Login"
                title="Login"
                onClick={() => {
                  document.cookie = `sessionId=; domain=${config.api_parent_domain}; SameSite=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
                  window.location.href = "/login";
                }}
                className="sidebar-button login"
              >
                <EnterIcon width={20} height={20} />
              </button>
            </>
          )}
        </div>
      </aside>

      {/* SEARCH PANEL */}
      {showSearch && (
        <div className="search-panel" ref={searchRef}>
          <h2>Search</h2>

          <input
            type="text"
            placeholder="Search for people..."
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* When empty */}
          {query.length === 0 && (
            <div className="search-placeholder">
            Start typing to search for people...
            </div>
          )}

          {/* No results */}
          {query.length > 0 && results.length === 0 && (
            <div className="search-placeholder">
            No Users Found.
          </div>
          )}

          {/* RESULTS LIST */}
          <div className="search-results">
              {results.map((u) => (
                <Profile key={u.username} u={u} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
