import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import Hero from "@/app/components/landing/Hero";
import Problem from "@/app/components/landing/Problem";
import WhatYouGet from "@/app/components/landing/WhatYouGet";
import Example from "@/app/components/landing/Example";
import HowItWorks from "@/app/components/landing/HowItWorks";
import Permanence from "@/app/components/landing/Permanence";
import Testimonials from "@/app/components/landing/Testimonials";
import WhoItsFor from "@/app/components/landing/WhoItsFor";
import Pricing from "@/app/components/landing/Pricing";
import Faq from "@/app/components/landing/Faq";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <WhatYouGet />
        <Example />
        <HowItWorks />
        <Permanence />
        <Testimonials />
        <WhoItsFor />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
