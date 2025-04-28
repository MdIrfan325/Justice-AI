import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import CategorySelector from "../components/glossary/CategorySelector";
import GlossaryTerm from "../components/glossary/GlossaryTerm";
import { Skeleton } from "@/components/ui/skeleton";

const Glossary = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/glossary/categories'],
  });
  
  const { data: terms, isLoading: termsLoading } = useQuery({
    queryKey: ['/api/glossary/terms', selectedCategory],
  });
  
  const filteredTerms = terms?.filter(term => 
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-primary font-montserrat text-3xl font-bold mb-4">{t('glossary.title')}</h1>
        <p className="text-gray-600 mb-6">{t('glossary.description')}</p>
        
        {/* Categories */}
        {categoriesLoading ? (
          <div className="flex flex-wrap gap-2 mb-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-10 w-32 rounded-lg" />
            ))}
          </div>
        ) : (
          <CategorySelector 
            categories={categories || []} 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}
        
        {/* Search Box */}
        <div className="relative mb-6">
          <Input
            type="text"
            className="w-full pl-10 pr-4 py-3"
            placeholder={t('glossary.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
        
        {/* Glossary Terms Grid */}
        {termsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <Skeleton key={i} className="h-40 w-full rounded-lg" />
            ))}
          </div>
        ) : filteredTerms && filteredTerms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTerms.map(term => (
              <GlossaryTerm 
                key={term.id} 
                term={term.term} 
                definition={term.definition} 
                category={term.category}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">
              <i className="ri-file-search-line text-gray-300"></i>
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">{t('glossary.noTermsFound')}</h3>
            <p className="text-gray-500">{t('glossary.tryDifferentSearch')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Glossary;
