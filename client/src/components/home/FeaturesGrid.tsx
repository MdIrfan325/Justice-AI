import { useTranslation } from "react-i18next";
import { Link } from "wouter";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  link: string;
  linkText: string;
  bgColor: string;
}

const FeatureCard = ({ icon, title, description, link, linkText, bgColor }: FeatureCardProps) => (
  <div className="bg-white rounded-lg shadow-md p-6 transition-custom hover:shadow-lg">
    <div className="flex items-start mb-4">
      <div className={`mr-4 w-12 h-12 flex items-center justify-center rounded-lg ${bgColor} text-primary text-2xl`}>
        <i className={icon}></i>
      </div>
      <div>
        <h3 className="font-montserrat font-semibold text-primary text-lg mb-1">{title}</h3>
        <p className="text-dark text-sm">{description}</p>
      </div>
    </div>
    <Link href={link}>
      <div className="text-accent text-sm font-medium flex items-center hover:underline mt-2 cursor-pointer">
        <span>{linkText}</span>
        <i className="ri-arrow-right-line ml-1"></i>
      </div>
    </Link>
  </div>
);

const FeaturesGrid = () => {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: "ri-book-2-line",
      title: t('features.glossary.title'),
      description: t('features.glossary.description'),
      link: "/glossary",
      linkText: t('features.glossary.link'),
      bgColor: "bg-lavender"
    },
    {
      icon: "ri-question-line",
      title: t('features.quizzes.title'),
      description: t('features.quizzes.description'),
      link: "/glossary",
      linkText: t('features.quizzes.link'),
      bgColor: "bg-lavender"
    },
    {
      icon: "ri-robot-line",
      title: t('features.aiQA.title'),
      description: t('features.aiQA.description'),
      link: "/ai-qa",
      linkText: t('features.aiQA.link'),
      bgColor: "bg-lavender"
    },
    {
      icon: "ri-file-search-line",
      title: t('features.docAnalysis.title'),
      description: t('features.docAnalysis.description'),
      link: "/documents",
      linkText: t('features.docAnalysis.link'),
      bgColor: "bg-mint"
    },
    {
      icon: "ri-translate-2",
      title: t('features.multilingual.title'),
      description: t('features.multilingual.description'),
      link: "#",
      linkText: t('features.multilingual.link'),
      bgColor: "bg-mint"
    },
    {
      icon: "ri-draft-line",
      title: t('templates.title', 'Legal Document Templates'),
      description: t('templates.description', 'Create professional legal documents using our templates.'),
      link: "/templates",
      linkText: t('features.docAnalysis.link', 'Create Documents'),
      bgColor: "bg-mint"
    }
  ];

  return (
    <section className="mb-8">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-primary font-montserrat text-2xl font-bold">{t('features.title')}</h2>
        <Link href="/glossary">
          <div className="text-accent flex items-center hover:underline cursor-pointer">
            <span>{t('features.viewAll')}</span>
            <i className="ri-arrow-right-line ml-1"></i>
          </div>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            link={feature.link}
            linkText={feature.linkText}
            bgColor={feature.bgColor}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturesGrid;
