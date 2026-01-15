import HeroSection from "@/components/sections/hero-section";
import FeaturesSection from "@/components/sections/features-section";
import HowItWorksSection from "@/components/sections/how-it-works-section";
import ProductsShowcaseSection from "@/components/sections/products-showcase-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ProductsShowcaseSection />
      <HowItWorksSection />
    </>
  );
}
