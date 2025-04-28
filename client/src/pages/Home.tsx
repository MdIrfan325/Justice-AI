import HeroSection from "../components/home/HeroSection";
import FeaturesGrid from "../components/home/FeaturesGrid";
import GlossaryPreview from "../components/home/GlossaryPreview";
import NewsSection from "../components/home/NewsSection";
import AIFeatureSection from "../components/home/AIFeatureSection";

const Home = () => {
  return (
    <div className="container mx-auto px-4">
      <HeroSection />
      <FeaturesGrid />
      <GlossaryPreview />
      <NewsSection />
      <AIFeatureSection />
    </div>
  );
};

export default Home;
