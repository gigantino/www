import BlogPosts from "@/components/BlogPosts";
import Footer from "@/components/Footer";
import Greeting from "@/components/Greeting";
import Header from "@/components/Header";
import MainLinks from "@/components/MainLinks";
import { ThemePicker } from "@/components/ThemePicker";

export default function Home() {
  return (
    <div className="w-full m-auto max-w-[65ch] px-6 py-14 dark:text-white/80 flex flex-col gap-5">
      <Header />
      <Greeting />
      <p>
        I'm a 22-year-old full-stack developer with over 5 years of experience
        under my belt, currently based in Geneva, Switzerland.
      </p>
      <p>
        I work with web technologies daily, and I also enjoy tinkering with
        hardware and lower-level programming languages in my spare time.
      </p>
      <p>
        When I'm not working on my 23rd side project, you'll most likely find me
        in a bouldering gym or being overly excited about air fryers.
      </p>
      <MainLinks />
      <BlogPosts />
      <hr />
      <p>
        I've been using Linux for roughly 10 years (with Ubuntu 13.10 being the
        first distro I've ever installed).
      </p>
      <p>
        Arch has been my daily driver for more than three years, yet the
        corporate world has managed to make me to switch to the dark side. You
        guessed it - I'm now officially an Apple user. You either die a hero, or
        you live long enough to see yourself become the villain.
      </p>
      <hr />
      <Footer />
      <ThemePicker />
    </div>
  );
}
