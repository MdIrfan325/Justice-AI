import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";

interface GlossaryTermProps {
  term: string;
  definition: string;
  category: string;
  termId?: number;
}

const GlossaryTerm = ({ term, definition, category, termId }: GlossaryTermProps) => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Fetch detailed term data when dialog opens
  const { data: termDetails } = useQuery<any>({
    queryKey: ['/api/glossary/term', termId],
    enabled: isDialogOpen && !!termId,
  });
  
  return (
    <>
      <div 
        className="border border-gray-100 rounded-lg p-5 hover:border-lavender transition-custom shadow-sm hover:shadow-md cursor-pointer"
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="flex items-start">
          <div className="w-8 h-8 rounded-full bg-lavender flex items-center justify-center text-primary mr-3 flex-shrink-0">
            <i className="ri-book-2-line"></i>
          </div>
          <div>
            <h3 className="font-montserrat font-semibold text-primary text-lg">{term}</h3>
            <p className="text-dark text-sm mt-1 line-clamp-3 glossary-term-content">{definition}</p>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
          <span className="bg-lavender px-2 py-1 rounded-sm text-xs text-primary">{category}</span>
          <Button 
            variant="ghost" 
            className="text-accent hover:bg-lavender hover:bg-opacity-20 text-sm h-auto py-1"
            onClick={(e) => {
              e.stopPropagation();
              setIsDialogOpen(true);
            }}
          >
            <i className="ri-book-open-line mr-1"></i>
            <span>{t('glossaryPreview.learnMore')}</span>
          </Button>
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-lavender flex items-center justify-center text-primary mr-3">
                <i className="ri-book-2-line text-lg"></i>
              </div>
              <DialogTitle className="text-2xl font-montserrat text-primary">{term}</DialogTitle>
            </div>
            <div className="flex items-center py-2 border-b">
              <span className="bg-lavender px-2 py-1 rounded-sm text-xs text-primary mr-2">{category}</span>
              {termDetails?.isImportant && (
                <span className="bg-orange-100 px-2 py-1 rounded-sm text-xs text-orange-700">
                  <i className="ri-star-line mr-1"></i>
                  {t('glossary.important', 'Important')}
                </span>
              )}
            </div>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            <div>
              <h4 className="font-medium mb-2 text-primary flex items-center">
                <i className="ri-information-line mr-2"></i>
                {t('glossary.definition')}
              </h4>
              <p className="text-dark glossary-term-content">{definition}</p>
            </div>
            
            {termDetails?.explanationHtml && (
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3 text-primary flex items-center">
                  <i className="ri-book-open-line mr-2"></i>
                  {t('glossary.explanation')}
                </h4>
                <div 
                  className="prose prose-sm max-w-none prose-headings:text-primary prose-a:text-accent"
                  dangerouslySetInnerHTML={{ __html: termDetails.explanationHtml }} 
                />
              </div>
            )}
            
            {termDetails?.references && (
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2 text-primary flex items-center">
                  <i className="ri-links-line mr-2"></i>
                  {t('glossary.references')}
                </h4>
                <p className="text-gray-600 text-sm">{termDetails.references}</p>
              </div>
            )}
            
            {termDetails?.relatedTerms && termDetails.relatedTerms.length > 0 && (
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3 text-primary flex items-center">
                  <i className="ri-more-2-fill mr-2"></i>
                  {t('glossary.relatedTerms', 'Related Terms')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {termDetails.relatedTerms.map((relatedTerm: string, idx: number) => (
                    <span key={idx} className="bg-secondary px-3 py-1 rounded-full text-xs text-dark">
                      {relatedTerm}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              {t('glossary.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GlossaryTerm;
