export default function SpotifySkeleton() {
  return (
    <div className="border p-3 dark:border-zinc-700 dark:bg-zinc-950 animate-pulse">
      <div className="flex h-16 w-full items-center space-x-4">
        <div className="h-16 aspect-square flex-nowrap rounded-md bg-zinc-300 dark:bg-zinc-700"></div>
        <div className="flex w-full flex-col space-y-2">
          <div className="h-4 w-3/4 rounded-md bg-zinc-300 dark:bg-zinc-700"></div>
          <div className="h-3 w-1/2 rounded-md bg-zinc-300 dark:bg-zinc-700"></div>
        </div>
      </div>
    </div>
  );
}
