"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface PostData {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  author: string | null;
  published: boolean | null;
  publishedAt: string | null;
  createdAt: string | null;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function RecentPosts({ data }: { data: PostData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Blog Posts</CardTitle>
        <CardDescription>Latest content from the blog</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">
            No blog posts available
          </p>
        ) : (
          <div className="space-y-3">
            {data.map((post) => (
              <div
                key={post.id}
                className="flex items-start justify-between gap-2 py-2 border-b last:border-b-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{post.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {post.category && (
                      <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {post.category}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {post.author}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      post.published
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(post.publishedAt || post.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
