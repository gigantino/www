import { MdVerified } from "react-icons/md";

export default function Header() {
  return (
    <nav className="text-zinc-700 dark:text-white/80">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-1">
          <a href="/">
            <h1 className="text-2xl font-extrabold">
              <span className="text-zinc-900 dark:text-white">ggtn</span>
              <span className="text-purple-600 dark:text-purple-400">.dev</span>
            </h1>
          </a>
          <div className="flex items-center gap-1">
            <MdVerified className="text-blue-600 dark:text-blue-400" />
            <div>Verified (I paid $12 for this domain)</div>
          </div>
        </div>
      </div>
    </nav>
  );
}
