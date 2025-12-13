"use client";

import { useState, useEffect, useRef } from "react";
import Post from "./components/post";
import { useAuth } from "@/app/AuthWrapper";
import { config } from "../config";
import "./feed.css";
import { EnterIcon } from "@radix-ui/react-icons";
import Profile from "./components/profile";

export default function FeedPage({ posts }: any) {
  const { user } = useAuth();

  const [postsState, setPosts] = useState(posts || []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [trendingUsers, setTrendingUsers] = useState<any[]>([]);

  const feedRef = useRef<HTMLDivElement | null>(null);

  // Load posts
  const loadMorePosts = async (nextPage?: number) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const p = nextPage || page + 1;
      const res = await fetch(`${config.api_url}/feed?page=${p}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev: any) => [...prev, ...data.posts]);
        setPage(data.page);
        setHasMore(data.hasMore);
        setTrendingUsers(data.trendingUsers);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Attach scroll listener
  useEffect(() => {
    const container = feedRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight * 0.9) {
        loadMorePosts();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page]);

  // Ensure first page loads if `posts` prop is empty
  useEffect(() => {
    if (postsState.length === 0) {
      loadMorePosts(1);
    }
  }, []);

  return (
    <div className="page">
      <div className="feed-header">
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        { user !== null ? (<span
            className="display-name"
            style={{ fontSize: 26, fontWeight: 650 }}
          >
            Welcome back, {user?.displayName} 👋
          </span>
        ) : (<span className="title"
                    style={{ fontSize: 26, fontWeight: 650 }} onClick={() => {
                      document.cookie = "sessionId=; domain=; SameSite=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                      window.location.href = "/login";
                    }}>
                    Login to BlogIt <button
                                    aria-label="Login"
                                    title="Login"
                                    className="sidebar-button login"
                                  >
                                    <EnterIcon width={20} height={20} />
                                  </button>
            </span> )}
        </div>
      </div>

    <hr className="divider" />
    <div className="main-container">
    <div
      className="feed-page"
      ref={feedRef}
    >
      <div className="posts-section">
        {postsState.length === 0 && !loading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "50px",
              color: "#666",
            }}
          >
            <span style={{ fontSize: "18px", fontWeight: 500 }}>No posts yet</span>
            <span style={{ fontSize: "14px" }}>
              When someone shares posts, they'll appear here.
            </span>
          </div>
        )}

        {postsState.map((post: any, index: number) => (
          <Post
            key={index}
            username={post.user.username}
            displayName={post.user.displayName}
            content={post.content}
            createdAt={post.dateofcreation}
          />
        ))}

        {loading && (
          <div style={{ textAlign: "center", padding: 20, color: "#999" }}>
            Loading...
          </div>
        )}

        {!hasMore && postsState.length > 0 && (
          <div style={{ textAlign: "center", padding: 20, color: "#999" }}>
            Looks Like You've Reached the End
          </div>
        )}
      </div>
    </div>
      <div className="side-panel">
        {
          user && (
            <>
            <div className="side-section">
              <span className="side-section-title">You're Following:</span>
              { user?.following.length !== 0 ?
                (
                  <div className="profiles-list">
                  {
                    user?.following.map((user: any, index: number) => (
                      <Profile u={user} key={index}></Profile>
                    ))
                  }
                  </div>
                ) :
                (
                  <span style={{textAlign: 'center', color: 'rgba(255, 255, 255, 0.35)'}}>You're currently not following anyone.</span>
                )
              }
            </div>
            <div className="side-section">
              <span className="side-section-title">Your Followers:</span>
              { user?.followers.length !== 0 ?
                (
                  <div className="profiles-list">
                  {
                    user?.followers.map((user: any, index: number) => (
                      <Profile u={user} key={index}></Profile>
                    ))
                  }
                  </div>
                ) :
                (
                  <span style={{textAlign: 'center', color: 'rgba(255, 255, 255, 0.35)'}}>You currently don't have any followers.</span>
                )
              }
            </div>
            </>
          )
        }
        <div className="side-section">
          <span className="side-section-title">Find People:</span>
          <div className="profiles-list">
            {
              trendingUsers.map((user: any, index: number) => (
                <Profile u={user} key={index}></Profile>
              ))
            }
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}