import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const AIFeatureSection = () => {
  const { t } = useTranslation();

  return (
    <section className="mb-8">
      <div className="bg-mint bg-opacity-50 rounded-lg p-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
            <h2 className="text-primary font-montserrat text-2xl font-bold mb-4">{t('aiFeature.title')}</h2>
            <p className="text-dark mb-4">{t('aiFeature.description')}</p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <i className="ri-check-line text-accent text-xl mr-2"></i>
                <span>{t('aiFeature.benefit1')}</span>
              </li>
              <li className="flex items-start">
                <i className="ri-check-line text-accent text-xl mr-2"></i>
                <span>{t('aiFeature.benefit2')}</span>
              </li>
              <li className="flex items-start">
                <i className="ri-check-line text-accent text-xl mr-2"></i>
                <span>{t('aiFeature.benefit3')}</span>
              </li>
            </ul>
            <Link href="/documents">
              <Button className="bg-accent hover:bg-opacity-90 text-white px-6 py-3 rounded-lg font-medium transition-custom h-auto">
                {t('aiFeature.analyzeButton')}
              </Button>
            </Link>
          </div>
          
          <div className="md:w-1/2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-montserrat font-semibold text-primary">{t('aiFeature.contractAnalyzer')}</h3>
                <div className="bg-lavender text-primary px-3 py-1 rounded-lg text-sm font-medium">
                  <i className="ri-ai-generate mr-1"></i>
                  <span>{t('aiFeature.aiPowered')}</span>
                </div>
              </div>
              
              <div className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center mb-4">
                <i className="ri-file-upload-line text-gray-400 text-3xl mb-2"></i>
                <p className="text-center text-sm text-gray-500 mb-2">{t('aiFeature.dropFile')}</p>
                <Link href="/documents">
                  <Button variant="default" className="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded-lg text-sm transition-custom h-auto">
                    {t('aiFeature.uploadDocument')}
                  </Button>
                </Link>
              </div>
              
              <div className="bg-lavender bg-opacity-50 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center mr-2">
                    <span className="text-white text-xs">1</span>
                  </div>
                  <h4 className="font-medium text-primary">{t('aiFeature.exampleAnalysis')}</h4>
                </div>
                <div className="pl-8">
                  <p className="text-sm font-semibold text-primary mb-1">{t('aiFeature.exampleSection')}</p>
                  <p className="text-sm text-dark mb-2">"{t('aiFeature.exampleText')}"</p>
                  <div className="bg-white p-3 rounded-lg border-l-4 border-accent">
                    <p className="text-xs text-dark">
                      <span className="font-medium text-accent">{t('aiFeature.aiAnalysis')}:</span> {t('aiFeature.analysisText')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 italic">
                {t('aiFeature.poweredBy')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIFeatureSection;
