import { useState } from "react";
import LanguageSelector from "./ui/language-selector";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-primary shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="mr-3 text-highlight text-2xl">
              <i className="ri-scales-3-line"></i>
            </div>
            <h1 className="text-white font-montserrat font-bold text-xl">JusticeAI</h1>
          </div>
          
          {/* Desktop: Language Selector and User Menu */}
          <div className="hidden md:flex items-center">
            <LanguageSelector />
            
            {/* User Menu */}
            <div className="ml-4 relative">
              <button className="flex items-center space-x-2 text-white">
                <Avatar className="h-8 w-8 bg-lavender">
                  <AvatarFallback className="text-primary font-medium">JS</AvatarFallback>
                </Avatar>
                <i className="ri-arrow-down-s-line"></i>
              </button>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-white text-xl"
            >
              {isMobileMenuOpen ? (
                <i className="ri-close-line"></i>
              ) : (
                <i className="ri-menu-line"></i>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary border-t border-white border-opacity-10">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-2">
            <LanguageSelector isMobile={true} />
            <div className="flex items-center text-white justify-between">
              <span>John Smith</span>
              <Avatar className="h-8 w-8 bg-lavender">
                <AvatarFallback className="text-primary font-medium">JS</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
