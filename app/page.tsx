import Badge from "@/components/Badge";
import BlogPosts from "@/components/BlogPosts";
import Footer from "@/components/Footer";
import Greeting from "@/components/Greeting";
import Header from "@/components/Header";
import { IArch, INvim, ISwitzerland } from "@/components/icons";
import MainLinks from "@/components/MainLinks";
import ProjectListServer from "@/components/ProjectListServer";
import { ThemePicker } from "@/components/ThemePicker";

export default function Home() {
  return (
    <div className="w-full m-auto max-w-[65ch] px-6 py-14 dark:text-white/80 flex flex-col gap-5 leading-7">
      <Header />
      <Greeting />
      <p>
        I'm a <Badge type="age" /> full-stack developer with over 5 years of
        experience under my belt, currently based in{" "}
        <Badge
          icon={<ISwitzerland />}
          type="url"
          text="Geneva, Switzerland"
          href="https://www.google.ch/maps/place/Genf/"
          target="_blank"
        />
      </p>
      <p>
        I work with web technologies daily, and I also enjoy tinkering with
        hardware and lower-level programming languages in my spare time.
      </p>
      <p>
        When I'm not working on my 23rd side project, you'll most likely find me
        in a <Badge type="text" text="🧗 bouldering gym" /> or being overly
        excited about <Badge type="text" text="👨‍🍳 air fryers" /> (mmmhm...
        chicken).
      </p>
      <MainLinks />
      <BlogPosts />
      <hr />
      <p>
        I've been using Linux for roughly 10 years (with Ubuntu 13.10 being the
        first distro I've ever installed).
      </p>
      <p>
        <Badge
          icon={<IArch />}
          type="url"
          href="https://archlinux.org/"
          target="_blank"
          text="Arch"
        />{" "}
        has been my daily driver for more than three years, yet the corporate
        world has managed to make me switch to the dark side 😱. You guessed
        it—I'm now officially an Apple user. You either die a hero, or you live
        long enough to see yourself become the villain.
      </p>
      <p>
        Yet, I still remain loyal to{" "}
        <Badge
          icon={<INvim />}
          type="url"
          href="https://neovim.io/"
          target="_blank"
          text="Neovim"
        />{" "}
        . Just that, according to{" "}
        <a
          href="https://www.youtube.com/c/theprimeagen"
          target="_blank"
          className="underline text-white"
        >
          ThePrimeAgen
        </a>
        , automatically qualifies me as a 100x developer.
      </p>
      <hr />
      <ProjectListServer />
      <Footer />
      <ThemePicker />
    </div>
  );
}
