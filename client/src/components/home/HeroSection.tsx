import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const HeroSection = () => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  
  return (
    <section className="mb-8">
      <div className="bg-primary rounded-lg p-8 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-6 md:mb-0">
          <h1 className="text-white font-montserrat text-3xl md:text-4xl font-bold mb-4">
            {t('hero.title')}
          </h1>
          <p className="text-white opacity-90 mb-6">
            {t('hero.description')}
          </p>
          
          <div className="flex space-x-4">
            <Link href="/ai-qa">
              <Button 
                className="bg-accent hover:bg-opacity-90 text-white border-none px-6 py-3 rounded-lg font-medium transition-custom h-auto"
              >
                {t('hero.tryAIButton')}
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="bg-white bg-opacity-10 hover:bg-opacity-20 text-white border border-white border-opacity-30 px-6 py-3 rounded-lg font-medium transition-custom h-auto"
            >
              {t('hero.exploreButton')}
            </Button>
          </div>
        </div>
        
        <div className="md:w-5/12">
          <div className="relative w-full h-64 md:h-80">
            {/* Decorative elements */}
            <div className="absolute top-4 left-4 bg-lavender w-full h-full rounded-lg"></div>
            <div className="absolute top-2 left-2 bg-mint w-full h-full rounded-lg"></div>
            <div className="absolute inset-0 bg-white rounded-lg shadow-md p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="font-montserrat font-medium text-primary">{t('hero.aiAssistant')}</span>
                <i className="ri-robot-line text-2xl text-accent"></i>
              </div>
              
              <div className="bg-secondary p-3 rounded-lg mb-3">
                <p className="text-dark text-sm">{t('hero.sampleQuestion')}</p>
              </div>
              
              <div className="bg-mint p-3 rounded-lg mb-2 animate-pulse">
                <div className="flex items-start mb-2">
                  <i className="ri-robot-line mr-2 text-primary pt-1"></i>
                  <p className="text-dark text-sm">{t('hero.sampleAnswer.intro')}</p>
                </div>
                <ol className="list-decimal list-inside text-dark text-sm pl-6 space-y-1">
                  <li>{t('hero.sampleAnswer.step1')}</li>
                  <li>{t('hero.sampleAnswer.step2')}</li>
                  <li>{t('hero.sampleAnswer.step3')}</li>
                </ol>
                <p className="text-xs text-primary mt-2">{t('hero.sampleAnswer.citation')}</p>
              </div>
              
              <div className="mt-auto">
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full rounded-lg border border-gray-200 pl-4 pr-10 py-2 text-sm" 
                    placeholder={t('hero.askPlaceholder')}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <Link href="/ai-qa">
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-accent">
                      <i className="ri-send-plane-fill"></i>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
