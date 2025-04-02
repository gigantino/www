import { Suspense } from "react";
import Spotify from "./Spotify";
import SpotifySkeleton from "./skeletons/Spotify";

export default function Footer() {
  return (
    <div className="flex flex-col gap-5">
      <p>
        If you are interested in seeing how this website was built, the entire
        source code can be found on{" "}
        <a
          href="https://github.com/gigantino/www"
          className="dark:text-white underline"
        >
          GitHub
        </a>{" "}
        under the{" "}
        <a
          href="https://github.com/gigantino/www/blob/main/LICENSE"
          className="dark:text-white underline"
        >
          MIT license
        </a>
        .
      </p>
      <p>
        I can't live without music. Check out the last song I was listening to
        on Spotify:
      </p>
      <Suspense fallback={<SpotifySkeleton />}>
        <Spotify />
      </Suspense>
      <p>
        Somewhat inspired by{" "}
        <a
          href="https://motherfuckingwebsite.com/"
          className="dark:text-white underline"
        >
          this website
        </a>
        .
      </p>
    </div>
  );
}
