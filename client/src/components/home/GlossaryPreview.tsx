import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

const GlossaryPreview = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("constitutional-law");
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/glossary/categories'],
  });
  
  const { data: terms, isLoading: termsLoading } = useQuery({
    queryKey: ['/api/glossary/terms', activeCategory],
  });
  
  const filteredTerms = terms?.filter(term => 
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="mb-8">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-primary font-montserrat text-2xl font-bold">{t('glossaryPreview.title')}</h2>
        <Link href="/glossary">
          <a className="text-accent flex items-center hover:underline">
            <span>{t('glossaryPreview.viewFull')}</span>
            <i className="ri-arrow-right-line ml-1"></i>
          </a>
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Glossary Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categoriesLoading ? (
            Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-10 w-36 rounded-lg" />
            ))
          ) : (
            categories?.map(category => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-custom ${
                  activeCategory === category.value
                    ? "bg-lavender text-primary"
                    : "bg-secondary hover:bg-lavender hover:bg-opacity-50 text-dark"
                }`}
                onClick={() => setActiveCategory(category.value)}
              >
                {category.label}
              </button>
            ))
          )}
        </div>
        
        {/* Search Box */}
        <div className="relative mb-6">
          <Input
            type="text"
            className="w-full pl-10 pr-4 py-3"
            placeholder={t('glossaryPreview.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
        
        {/* Glossary Terms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {termsLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-lg" />
            ))
          ) : filteredTerms?.length ? (
            filteredTerms.slice(0, 4).map(term => (
              <div key={term.id} className="border border-gray-100 rounded-lg p-4 hover:border-lavender transition-custom cursor-pointer">
                <h3 className="font-montserrat font-semibold text-primary">{term.term}</h3>
                <p className="text-dark text-sm mt-1">{term.definition}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="bg-lavender px-2 py-1 rounded-sm text-xs text-primary">{term.categoryLabel}</span>
                  <Link href={`/glossary/${term.id}`}>
                    <a className="text-accent hover:underline text-sm">
                      <i className="ri-book-open-line mr-1"></i>
                      <span>{t('glossaryPreview.learnMore')}</span>
                    </a>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-8">
              <p className="text-gray-500">{t('glossaryPreview.noTermsFound')}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GlossaryPreview;
