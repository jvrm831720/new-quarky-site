import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Hero } from "@/components/sections/Hero";
import { Problema } from "@/components/sections/Problema";
import { QuarkyHolding } from "@/components/sections/QuarkyHolding";
import { Atlas } from "@/components/sections/Atlas";
import { OrionFlow } from "@/components/sections/OrionFlow";
import { RoadmapSection } from "@/components/RoadmapSection";
import { Visao } from "@/components/sections/Visao";
import { Sobre } from "@/components/sections/Sobre";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Problema />
        <QuarkyHolding />
        <Atlas />
        <OrionFlow />
        <RoadmapSection />
        <Visao />
        <Sobre />
      </main>
      <Footer />
    </>
  );
}
