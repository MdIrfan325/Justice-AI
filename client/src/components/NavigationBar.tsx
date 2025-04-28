import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";

const NavigationBar = () => {
  const [location] = useLocation();
  const { t } = useTranslation();
  
  const navItems = [
    { path: "/", icon: "ri-home-4-line", label: t("nav.home") },
    { path: "/glossary", icon: "ri-book-2-line", label: t("nav.glossary") },
    { path: "/ai-qa", icon: "ri-question-answer-line", label: t("nav.aiQA") },
    { path: "/documents", icon: "ri-file-text-line", label: t("nav.documents") },
    { path: "/news", icon: "ri-newspaper-line", label: t("nav.news") },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-1 py-2 min-w-max">
            {navItems.map((item) => {
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <div className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-dark transition-custom ${
                    isActive 
                      ? "bg-lavender text-primary font-medium" 
                      : "hover:bg-lavender hover:bg-opacity-50"
                  }`}>
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
