import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DocumentUploader from "../components/documents/DocumentUploader";
import DocumentAnalysis from "../components/documents/DocumentAnalysis";

const Documents = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upload");
  const [documentId, setDocumentId] = useState<number | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any | null>(null);
  const [isReanalyzing, setIsReanalyzing] = useState(false);

  const handleDocumentUploaded = (id: string | number) => {
    // Ensure we're storing a number
    const numericId = typeof id === 'string' ? parseInt(id) : id;
    setDocumentId(numericId);
    setActiveTab("analysis");
  };

  const handleAnalysisComplete = (results: any) => {
    setAnalysisResults(results);
  };
  
  const handleReanalyzeDocument = async () => {
    if (!documentId) return;
    
    setIsReanalyzing(true);
    
    try {
      const response = await fetch(`/api/documents/reanalyze/${documentId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reanalyze document');
      }
      
      // Update with the new analysis
      if (data.analysis) {
        setAnalysisResults(data.analysis);
        toast({
          title: t('documents.reanalysisComplete'),
          description: t('documents.freshAnalysisAvailable'),
        });
      }
    } catch (error) {
      console.error('Error reanalyzing document:', error);
      toast({
        title: t('documents.reanalysisError'),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
    } finally {
      setIsReanalyzing(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-primary font-montserrat text-3xl font-bold mb-4">{t('documents.title')}</h1>
        <p className="text-gray-600 mb-6">{t('documents.description')}</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="upload">{t('documents.uploadTab')}</TabsTrigger>
          <TabsTrigger value="analysis" disabled={!documentId}>{t('documents.analysisTab')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <DocumentUploader onDocumentUploaded={handleDocumentUploaded} />
        </TabsContent>
        
        <TabsContent value="analysis">
          {documentId && (
            <>
              <div className="flex justify-end mb-4">
                <Button 
                  onClick={handleReanalyzeDocument} 
                  disabled={isReanalyzing}
                  variant="outline"
                  className="gap-2"
                >
                  {isReanalyzing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('documents.reanalyzing')}
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw">
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                        <path d="M21 3v5h-5"/>
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                        <path d="M8 16H3v5"/>
                      </svg>
                      {t('documents.reanalyze')}
                    </>
                  )}
                </Button>
              </div>
            
              <DocumentAnalysis 
                documentId={documentId} 
                analysisResults={analysisResults}
                onAnalysisComplete={handleAnalysisComplete}
              />
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documents;
