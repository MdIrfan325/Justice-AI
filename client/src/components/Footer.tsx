import { Link } from "wouter";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="mr-2 text-highlight text-2xl">
                <i className="ri-scales-3-line"></i>
              </div>
              <h2 className="font-montserrat font-bold text-xl">JusticeAI</h2>
            </div>
            <p className="text-white text-opacity-80 text-sm mb-4">
              {t('footer.tagline')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-highlight transition-custom">
                <i className="ri-twitter-x-line text-xl"></i>
              </a>
              <a href="#" className="text-white hover:text-highlight transition-custom">
                <i className="ri-linkedin-line text-xl"></i>
              </a>
              <a href="#" className="text-white hover:text-highlight transition-custom">
                <i className="ri-facebook-circle-line text-xl"></i>
              </a>
              <a href="#" className="text-white hover:text-highlight transition-custom">
                <i className="ri-instagram-line text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-montserrat font-semibold text-lg mb-4">{t('footer.features')}</h3>
            <ul className="space-y-2 text-white text-opacity-80">
              <li><Link href="/glossary" className="hover:text-highlight transition-custom">{t('footer.legalGlossary')}</Link></li>
              <li><Link href="/glossary" className="hover:text-highlight transition-custom">{t('footer.legalQuizzes')}</Link></li>
              <li><Link href="/ai-qa" className="hover:text-highlight transition-custom">{t('footer.aiLegalQA')}</Link></li>
              <li><Link href="/documents" className="hover:text-highlight transition-custom">{t('footer.documentAnalysis')}</Link></li>
              <li><Link href="/experts" className="hover:text-highlight transition-custom">{t('footer.expertDirectory')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-montserrat font-semibold text-lg mb-4">{t('footer.resources')}</h3>
            <ul className="space-y-2 text-white text-opacity-80">
              <li><a href="#" className="hover:text-highlight transition-custom">{t('footer.helpCenter')}</a></li>
              <li><a href="#" className="hover:text-highlight transition-custom">{t('footer.communityForum')}</a></li>
              <li><Link href="/news" className="hover:text-highlight transition-custom">{t('footer.legalNews')}</Link></li>
              <li><a href="#" className="hover:text-highlight transition-custom">{t('footer.faqs')}</a></li>
              <li><a href="#" className="hover:text-highlight transition-custom">{t('footer.contactSupport')}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-montserrat font-semibold text-lg mb-4">{t('footer.downloadApp')}</h3>
            <p className="text-white text-opacity-80 text-sm mb-4">
              {t('footer.appDescription')}
            </p>
            <div className="flex space-x-2">
              <a href="#" className="bg-white text-primary rounded-lg px-4 py-2 text-sm font-medium flex items-center">
                <i className="ri-google-play-line mr-1 text-lg"></i>
                <span>Google Play</span>
              </a>
              <a href="#" className="bg-white text-primary rounded-lg px-4 py-2 text-sm font-medium flex items-center">
                <i className="ri-apple-fill mr-1 text-lg"></i>
                <span>App Store</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white border-opacity-10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-white text-opacity-70 mb-4 md:mb-0">
            © {currentYear} JusticeAI. {t('footer.allRightsReserved')}
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-white text-opacity-70 hover:text-highlight transition-custom">{t('footer.termsOfService')}</a>
            <a href="#" className="text-sm text-white text-opacity-70 hover:text-highlight transition-custom">{t('footer.privacyPolicy')}</a>
            <a href="#" className="text-sm text-white text-opacity-70 hover:text-highlight transition-custom">{t('footer.cookiePolicy')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
