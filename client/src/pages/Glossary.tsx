import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategorySelector from "../components/glossary/CategorySelector";
import GlossaryTerm from "../components/glossary/GlossaryTerm";
import { Skeleton } from "@/components/ui/skeleton";
import { GlossaryCategory, GlossaryTerm as GlossaryTermType } from "@shared/schema";

// Define the category type for the selector component
type SelectorCategory = {
  id: number;
  value: string;
  label: string;
};

// Define subcategories for main legal domains
const subcategories: Record<string, string[]> = {
  "constitutional-law": ["Rights and Freedoms", "Government Powers", "Federalism", "Judicial Review"],
  "criminal-law": ["Offenses", "Criminal Procedure", "Evidence", "Sentencing"],
  "civil-law": ["Contracts", "Torts", "Property", "Family Law", "Corporate Law"],
  "tax-law": ["Income Tax", "Property Tax", "GST/HST", "Tax Avoidance"],
  "environmental-law": ["Pollution Control", "Wildlife Protection", "Land Use", "Climate Change"],
  "intellectual-property": ["Patents", "Trademarks", "Copyright", "Trade Secrets"]
};

const Glossary = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeSubcategory, setActiveSubcategory] = useState<string>("all");
  
  const { data: categories, isLoading: categoriesLoading } = useQuery<GlossaryCategory[]>({
    queryKey: ['/api/glossary/categories'],
  });
  
  const { data: terms, isLoading: termsLoading } = useQuery<GlossaryTermType[]>({
    queryKey: ['/api/glossary/terms', selectedCategory],
  });
  
  // Get current subcategories based on selected category
  const currentSubcategories = useMemo(() => {
    if (selectedCategory === "all" || !subcategories[selectedCategory]) {
      return [];
    }
    return subcategories[selectedCategory];
  }, [selectedCategory]);
  
  // Filter terms by search term and subcategory
  const filteredTerms = useMemo(() => {
    if (!terms) return [];
    
    return terms.filter((term: GlossaryTermType) => {
      const matchesSearch = 
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchTerm.toLowerCase());
        
      // If no subcategory is selected or we're in "all" mode, just check the search term
      if (activeSubcategory === "all" || currentSubcategories.length === 0) {
        return matchesSearch;
      }
      
      // In a real implementation, terms would have a subcategory field
      // For now, we're simulating this with a simple check on the term content
      const matchesSubcategory = 
        term.definition.includes(activeSubcategory) || 
        term.term.includes(activeSubcategory);
        
      return matchesSearch && matchesSubcategory;
    });
  }, [terms, searchTerm, activeSubcategory, currentSubcategories]);

  // Format categories for the selector component
  const formattedCategories: SelectorCategory[] = categories ? [
    { id: 0, value: "all", label: t('glossary.allCategories') },
    ...(categories || []).map(cat => ({
      id: cat.id,
      value: cat.value,
      label: cat.label
    }))
  ] : [];

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
            categories={formattedCategories} 
            selectedCategory={selectedCategory}
            onSelectCategory={(category) => {
              setSelectedCategory(category);
              setActiveSubcategory("all"); // Reset subcategory when main category changes
            }}
          />
        )}
        
        {/* Subcategories Tabs */}
        {currentSubcategories.length > 0 && (
          <div className="mb-6 mt-4">
            <Tabs defaultValue="all" onValueChange={setActiveSubcategory} value={activeSubcategory}>
              <TabsList className="mb-2 flex flex-wrap h-auto">
                <TabsTrigger value="all" className="mb-1 mr-1">
                  {t('glossary.allSubcategories', 'All Subcategories')}
                </TabsTrigger>
                {currentSubcategories.map((subcat, index) => (
                  <TabsTrigger key={index} value={subcat} className="mb-1 mr-1">
                    {subcat}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
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
            {filteredTerms.map((term: GlossaryTermType) => {
              // Find category label from the categories data
              const category = categories?.find(cat => cat.id === term.categoryId);
              
              return (
                <GlossaryTerm 
                  key={term.id} 
                  term={term.term} 
                  definition={term.definition} 
                  category={category?.label || ""}
                  termId={term.id}
                />
              );
            })}
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
