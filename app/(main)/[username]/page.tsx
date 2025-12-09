import "./profile.css";
import { notFound } from "next/navigation";
import { config } from "../../config";
import Profile from "./profile-page";
import { cookies } from "next/headers";

export default async function ProfilePage({ params }: { params: any }) {
  let { username } = await params;
  let displayName = '';
  let followingCount = 0;
  let followerCount = 0;
  let posts: Array<{author: string, authorDisplayName: string, content: string, createdAt: Date}> = [];
  let isFollowing = false;

  const cookieStore = await cookies();

  const sessionId = cookieStore.get("sessionId")?.value;

  const res = await fetch(`${config.api_url}/profile/${username}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `sessionId=${sessionId || ''}`,
    },
    credentials: 'include',
  });
  if (res.status === 404) {
    return notFound();
  }

  try {
    if (!res.ok) {
      throw new Error("Failed to fetch profile data");
    }
    const data = await res.json();
    username = data.username;
    displayName = data.displayName;
    followingCount = data.following;
    followerCount = data.followers;
    posts = data.posts;
    isFollowing = data.isFollowing || false;
  }
  catch (error) {
    throw new Error("Internal Server Error");
  }

  return (
    <Profile username={username} displayName={displayName} followingCount={followingCount} followerCount={followerCount} posts={posts} isFollowing={isFollowing}/>
  );
}
