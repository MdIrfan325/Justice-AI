import HeroSection from "../components/home/HeroSection";
import FeaturesGrid from "../components/home/FeaturesGrid";
import GlossaryPreview from "../components/home/GlossaryPreview";
import NewsSection from "../components/home/NewsSection";
import AIFeatureSection from "../components/home/AIFeatureSection";
import ExpertDirectoryPreview from "../components/home/ExpertDirectoryPreview";

const Home = () => {
  return (
    <div className="container mx-auto px-4">
      <HeroSection />
      <FeaturesGrid />
      <GlossaryPreview />
      <NewsSection />
      <AIFeatureSection />
      <ExpertDirectoryPreview />
    </div>
  );
};

export default Home;
