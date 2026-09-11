import Hero from "../../components/landing/Hero";
import Stats from "../../components/landing/Stats";
import Features from "../../components/landing/Features";
import Recruiters from "../../components/landing/Recruiters";
import Testimonials from "../../components/landing/Testimonials";
import CTA from "../../components/landing/CTA";

function Landing() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <Recruiters />
      <Testimonials />
      <CTA />
    </>
  );
}

export default Landing;