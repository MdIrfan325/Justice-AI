import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentUploader from "../components/documents/DocumentUploader";
import DocumentAnalysis from "../components/documents/DocumentAnalysis";

const Documents = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("upload");
  const [documentId, setDocumentId] = useState<number | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any | null>(null);

  const handleDocumentUploaded = (id: string | number) => {
    // Ensure we're storing a number
    const numericId = typeof id === 'string' ? parseInt(id) : id;
    setDocumentId(numericId);
    setActiveTab("analysis");
  };

  const handleAnalysisComplete = (results: any) => {
    setAnalysisResults(results);
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
            <DocumentAnalysis 
              documentId={documentId} 
              analysisResults={analysisResults}
              onAnalysisComplete={handleAnalysisComplete}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documents;
