import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface DocumentAnalysisProps {
  documentId: string | number;
  analysisResults: any | null;
  onAnalysisComplete: (results: any) => void;
}

// Default analysis structure to prevent missing properties errors
const DEFAULT_ANALYSIS = {
  summary: "Document analysis not available.",
  documentType: "Unknown",
  analysisTime: 0,
  pageCount: 0,
  keyInformation: [],
  potentialRisks: [],
  complianceChecks: []
};

const DocumentAnalysis = ({ 
  documentId, 
  analysisResults,
  onAnalysisComplete 
}: DocumentAnalysisProps) => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState("summary");
  
  // Custom query function to handle fetch with proper URL
  const fetchDocumentAnalysis = async () => {
    try {
      console.log(`Fetching analysis for document ID: ${documentId}`);
      const response = await fetch(`/api/documents/analyze/${documentId}`);
      
      // Parse the response
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error("Error fetching document analysis:", responseData);
        
        // If the server returned a fallback analysis, use it
        if (responseData.fallbackAnalysis) {
          return responseData.fallbackAnalysis;
        }
        
        throw new Error(responseData.message || `Error: ${response.status} ${response.statusText}`);
      }
      
      // Successfully got the analysis
      return responseData || DEFAULT_ANALYSIS;
    } catch (error) {
      console.error("Error fetching document analysis:", error);
      return DEFAULT_ANALYSIS;
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['/api/documents/analyze', documentId],
    queryFn: fetchDocumentAnalysis,
    enabled: !!documentId && !analysisResults,
    retry: 2,
    retryDelay: 1000,
  });
  
  useEffect(() => {
    if (data && !analysisResults) {
      // Ensure the data has all required properties
      const completeData = {
        ...DEFAULT_ANALYSIS,
        ...data
      };
      onAnalysisComplete(completeData);
    }
  }, [data, analysisResults, onAnalysisComplete]);
  
  // Use default values if properties are missing
  const results = analysisResults || data || DEFAULT_ANALYSIS;
  
  // Ensure arrays exist to prevent mapping errors
  const safeResults = {
    ...DEFAULT_ANALYSIS,
    ...results,
    keyInformation: Array.isArray(results?.keyInformation) ? results.keyInformation : [],
    potentialRisks: Array.isArray(results?.potentialRisks) ? results.potentialRisks : [],
    complianceChecks: Array.isArray(results?.complianceChecks) ? results.complianceChecks : []
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('documents.analyzing')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{t('documents.analysisError')}</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : t('documents.unknownError')}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('documents.analysisResults')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="summary">{t('documents.summary')}</TabsTrigger>
            <TabsTrigger value="keyInfo">{t('documents.keyInfo')}</TabsTrigger>
            <TabsTrigger value="risks">{t('documents.risks')}</TabsTrigger>
            <TabsTrigger value="compliance">{t('documents.compliance')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-4">
            <div className="p-4 bg-lavender bg-opacity-20 rounded-lg">
              <h3 className="font-medium text-lg text-primary mb-2">{t('documents.documentSummary')}</h3>
              <p className="text-gray-700 whitespace-pre-wrap break-words">{safeResults.summary}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl text-center text-primary mb-2">
                    <i className="ri-file-paper-2-line"></i>
                  </div>
                  <h4 className="text-center font-medium mb-1">{t('documents.documentType')}</h4>
                  <p className="text-center text-sm">{safeResults.documentType || "Unknown"}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl text-center text-primary mb-2">
                    <i className="ri-time-line"></i>
                  </div>
                  <h4 className="text-center font-medium mb-1">{t('documents.analysisTime')}</h4>
                  <p className="text-center text-sm">{safeResults.analysisTime || 0} {t('documents.seconds')}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl text-center text-primary mb-2">
                    <i className="ri-file-list-3-line"></i>
                  </div>
                  <h4 className="text-center font-medium mb-1">{t('documents.pageCount')}</h4>
                  <p className="text-center text-sm">{safeResults.pageCount || 0} {t('documents.pages')}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="keyInfo">
            <div className="space-y-4">
              {safeResults.keyInformation.length > 0 ? (
                safeResults.keyInformation.map((item: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h3 className="font-medium text-primary mb-2">{item.title || "Information"}</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{item.content || ""}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl text-gray-300 mb-4">
                    <i className="ri-information-line"></i>
                  </div>
                  <h3 className="text-xl font-medium text-gray-500 mb-2">{t('documents.noKeyInfoFound')}</h3>
                  <p className="text-gray-500">{t('documents.noAdditionalInfo')}</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="risks">
            <div className="space-y-4">
              {safeResults.potentialRisks.length > 0 ? (
                safeResults.potentialRisks.map((risk: any, index: number) => (
                  <Alert key={index} variant={(risk.severity === 'high') ? 'destructive' : 'default'}>
                    <AlertTitle className="flex flex-wrap items-center">
                      {risk.severity === 'high' && <i className="ri-error-warning-line mr-2"></i>}
                      {risk.severity === 'medium' && <i className="ri-alert-line mr-2"></i>}
                      {(risk.severity === 'low' || !risk.severity) && <i className="ri-information-line mr-2"></i>}
                      {risk.title || "Risk Factor"}
                      <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-100">
                        {(risk.severity || "medium").toUpperCase()}
                      </span>
                    </AlertTitle>
                    <AlertDescription className="whitespace-pre-wrap break-words">
                      {risk.description || "No details available"}
                    </AlertDescription>
                  </Alert>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl text-green-500 mb-4">
                    <i className="ri-shield-check-line"></i>
                  </div>
                  <h3 className="text-xl font-medium text-green-600 mb-2">{t('documents.noRisksFound')}</h3>
                  <p className="text-gray-500">{t('documents.documentSafe')}</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="compliance">
            <div className="space-y-4">
              {safeResults.complianceChecks.length > 0 ? (
                safeResults.complianceChecks.map((check: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg flex flex-wrap">
                    <div className="mr-4 mb-2">
                      {check.compliant ? (
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                          <i className="ri-check-line"></i>
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                          <i className="ri-close-line"></i>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-primary mb-1">{check.requirement || "Compliance Item"}</h3>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                        {check.details || "No details available"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl text-gray-400 mb-4">
                    <i className="ri-file-list-3-line"></i>
                  </div>
                  <h3 className="text-xl font-medium text-gray-600 mb-2">{t('documents.noComplianceData')}</h3>
                  <p className="text-gray-500">{t('documents.consultProfessional')}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentAnalysis;
