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
  const { data: termDetails } = useQuery({
    queryKey: ['/api/glossary/term', termId],
    enabled: isDialogOpen && !!termId,
  });
  
  return (
    <>
      <div className="border border-gray-100 rounded-lg p-4 hover:border-lavender transition-custom shadow-sm hover:shadow-md">
        <h3 className="font-montserrat font-semibold text-primary">{term}</h3>
        <p className="text-dark text-sm mt-1 line-clamp-3">{definition}</p>
        <div className="flex justify-between items-center mt-3">
          <span className="bg-lavender px-2 py-1 rounded-sm text-xs text-primary">{category}</span>
          <Button 
            variant="link" 
            className="text-accent hover:underline text-sm p-0 h-auto"
            onClick={() => setIsDialogOpen(true)}
          >
            <i className="ri-book-open-line mr-1"></i>
            <span>{t('glossaryPreview.learnMore')}</span>
          </Button>
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-montserrat text-primary">{term}</DialogTitle>
            <DialogDescription className="text-dark py-2 border-b">{category}</DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <h4 className="font-medium mb-2">{t('glossary.definition')}</h4>
            <p className="text-dark mb-4">{definition}</p>
            
            {termDetails?.explanationHtml && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">{t('glossary.explanation')}</h4>
                <div 
                  className="prose prose-sm"
                  dangerouslySetInnerHTML={{ __html: termDetails.explanationHtml }} 
                />
              </div>
            )}
            
            {termDetails?.references && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium mb-2">{t('glossary.references')}</h4>
                <p className="text-gray-600 text-sm">{termDetails.references}</p>
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
