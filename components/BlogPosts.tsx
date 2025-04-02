"use server";
import ArticleList from "./ArticleList";

export default async function BlogPosts() {
  return (
    <div className="py-4 flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold dark:text-white">Blog</h1>
      <ArticleList />
    </div>
  );
}
