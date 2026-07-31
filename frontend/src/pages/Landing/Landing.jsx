import Layout from "../../components/layout/Layout";

import Hero from "../../components/landing/Hero";
import Stats from "../../components/landing/Stats";
import Features from "../../components/landing/Features";
import Recruiters from "../../components/landing/Recruiters";
import Testimonials from "../../components/landing/Testimonials";
import CTA from "../../components/landing/CTA";

function Landing() {
  return (
    <Layout>
      <Hero />
      <Stats />
      <Features />
      <Recruiters />
      <Testimonials />
      <CTA />
    </Layout>
  );
}

export default Landing;