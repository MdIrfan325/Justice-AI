import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface LanguageSelectorProps {
  isMobile?: boolean;
}

const LanguageSelector = ({ isMobile = false }: LanguageSelectorProps) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLanguage = (() => {
    switch (i18n.language) {
      case 'hi':
        return 'हिन्दी';
      case 'te':
        return 'తెలుగు';
      default:
        return 'English';
    }
  })();
  
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsOpen(false);
  };
  
  if (isMobile) {
    return (
      <Button 
        variant="ghost" 
        className="flex items-center text-white justify-between w-full p-0 h-auto"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Language: {currentLanguage}</span>
        <i className={`ri-arrow-${isOpen ? 'up' : 'down'}-s-line`}></i>
        
        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-md shadow-lg z-50 p-1">
            <button 
              className="w-full text-left px-4 py-2 text-sm hover:bg-lavender hover:bg-opacity-50 rounded transition-custom"
              onClick={() => changeLanguage('en')}
            >
              English
            </button>
            <button 
              className="w-full text-left px-4 py-2 text-sm hover:bg-lavender hover:bg-opacity-50 rounded transition-custom"
              onClick={() => changeLanguage('hi')}
            >
              हिन्दी
            </button>
            <button 
              className="w-full text-left px-4 py-2 text-sm hover:bg-lavender hover:bg-opacity-50 rounded transition-custom"
              onClick={() => changeLanguage('te')}
            >
              తెలుగు
            </button>
          </div>
        )}
      </Button>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center text-white space-x-1 py-2 px-3 rounded-lg hover:bg-opacity-20 hover:bg-white transition-custom h-auto">
          <span>{currentLanguage}</span>
          <i className="ri-arrow-down-s-line"></i>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuItem onClick={() => changeLanguage('en')}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('hi')}>
          हिन्दी
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('te')}>
          తెలుగు
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
