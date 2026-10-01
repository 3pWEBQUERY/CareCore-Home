import Contact from "./components/contact";
import Faq from "./components/faq";
import Hero from "./components/hero";
import Interop from "./components/interop";
import Mobile from "./components/mobile";
import Modules from "./components/modules";
import Platform from "./components/platform";
import Principles from "./components/principles";
import Rollout from "./components/rollout";
import Security from "./components/security";
import Spotlights from "./components/spotlights";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Platform />
      <Modules />
      <Spotlights />
      <Mobile />
      <Security />
      <Principles />
      <Interop />
      <Rollout />
      <Faq />
      <Contact />
    </>
  );
}
