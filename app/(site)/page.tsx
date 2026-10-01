import Contact from "@/app/components/contact";
import Faq from "@/app/components/faq";
import Hero from "@/app/components/hero";
import Interop from "@/app/components/interop";
import Mobile from "@/app/components/mobile";
import Modules from "@/app/components/modules";
import Platform from "@/app/components/platform";
import Principles from "@/app/components/principles";
import Rollout from "@/app/components/rollout";
import Security from "@/app/components/security";
import Spotlights from "@/app/components/spotlights";

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
