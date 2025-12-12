"use client";
import { PersonIcon } from "@radix-ui/react-icons";
import "./post.css";
import { useRouter } from "next/navigation";

type PostProps = {
  username: string;
  displayName: string;
  content: string;
  createdAt: Date; // Add createdAt prop
};

export default function Post({ username, displayName, content, createdAt }: PostProps) {
    const router = useRouter();
  // Format the date
  const dateObj = new Date(createdAt);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const formattedDate = dateObj.toLocaleString("en-US", options);

  return (
    <div className="blog-card">
      <div className="blog-card-header" onClick={() => router.push(`/${username}`)}>
        <div className="blog-profile-icon-square">
          <PersonIcon width={24} height={24} />
        </div>
        <div className="blog-card-user">
          <span className="display-name">{displayName}</span>
          <span className="username">@{username}</span>
        </div>
      </div>
      <div className="blog-text" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br />") }} />
      <span className="post-time">{formattedDate}</span>
    </div>
  );
}