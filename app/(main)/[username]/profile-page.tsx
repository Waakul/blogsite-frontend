"use client";

import { useState } from "react";
import { PersonIcon, PlusIcon } from "@radix-ui/react-icons";
import Post from "../components/post";
import { useAuth } from "@/app/AuthWrapper";
import { config } from "@/app/config";

export default function ProfilePage({posts, displayName, username, followerCount, followingCount, isFollowing}: any): JSX.Element {
  const { user } = useAuth();

  // Posts state now comes from props initially
  const [postsState, setPosts] = useState(posts || []);
  const [isSharing, setIsSharing] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [isFollowingUser, setIsFollowingUser] = useState(isFollowing || false);

  const handlePost = async () => {
    if (!newPost.trim()) return;

    try {
      // Send to backend
      const res = await fetch(`${config.api_url}/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content: newPost,
        }),
      });

      if (!res.ok) throw new Error("Failed to create post");

      const data = await res.json();

      // Append to local posts state
      setPosts((prev: any) => [
        data.post,
        ...prev, // prepend to show newest first
      ]);

      // Reset share box
      setNewPost("");
      setIsSharing(false);
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post. Please try again.");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-info">
          <div className="avatar-square">
            <PersonIcon width={45} height={45} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginLeft: 12, width: "100%" }}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              <span className="display-name" style={{ marginRight: "15px" }}>
                {displayName}
              </span>
              <span className="username">@{username}</span>
              {username !== user?.username && user && (
                <button className={isFollowingUser ? "follow-button unfollow" : "follow-button follow"} style={{ marginLeft: "auto" }} onClick={async () => {
                    setIsFollowingUser(!isFollowingUser);
                    const res = await fetch(`${config.api_url}/follow/toggle/${username}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    });

                    if (!res.ok) {
                        alert("Failed to toggle follow status.");
                        return;
                    }
                }}>
                  {isFollowingUser ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
            <div className="follow-stats" style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
              <div className="stat" style={{ gap: "5px", display: "flex", flexDirection: "row" }}>
                <span className="stat-number" style={{ fontWeight: 650 }}>
                  {followerCount}
                </span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat" style={{ gap: "5px", display: "flex", flexDirection: "row" }}>
                <span className="stat-number" style={{ fontWeight: 650 }}>
                  {followingCount}
                </span>
                <span className="stat-label">Following</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* Share Post Box */}
      {user && username === user.username && (
        <div style={{ margin: "20px 0" }}>
          {!isSharing ? (
            <button
                className="share-button"
                onClick={() => setIsSharing(true)}
            >
                <PlusIcon className="plus-icon" />
                Post New Blog
            </button>
            ) : (
            <div className="share-box">
                <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind?"
                />
                <div className="share-actions">
                <button onClick={() => setIsSharing(false)} className="cancel-button">
                    Cancel
                </button>
                <button onClick={handlePost} className="post-button">
                    Post
                </button>
                </div>
            </div>
            )}
        </div>
      )}

      {/* Posts Section */}
      <div className="posts-section">
        {postsState.length === 0 && (
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
              When {displayName} shares posts, they'll appear here.
            </span>
          </div>
        )}

        {postsState.map((post: any, index: number) => (
          <Post
            key={index}
            username={`${post.author}`}
            displayName={post.authorDisplayName}
            content={post.content}
            createdAt={post.createdAt}
          />
        ))}
      </div>
    </div>
  );
}
