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

const DocumentAnalysis = ({ 
  documentId, 
  analysisResults,
  onAnalysisComplete 
}: DocumentAnalysisProps) => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState("summary");
  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['/api/documents/analyze', documentId],
    enabled: !analysisResults,
  });
  
  useEffect(() => {
    if (data && !analysisResults) {
      onAnalysisComplete(data);
    }
  }, [data, analysisResults, onAnalysisComplete]);
  
  const results = analysisResults || data;

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
  
  if (!results) {
    return (
      <Alert>
        <AlertTitle>{t('documents.noResults')}</AlertTitle>
        <AlertDescription>{t('documents.pleaseUpload')}</AlertDescription>
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
              <p className="text-gray-700">{results.summary}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl text-center text-primary mb-2">
                    <i className="ri-file-paper-2-line"></i>
                  </div>
                  <h4 className="text-center font-medium mb-1">{t('documents.documentType')}</h4>
                  <p className="text-center text-sm">{results.documentType}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl text-center text-primary mb-2">
                    <i className="ri-time-line"></i>
                  </div>
                  <h4 className="text-center font-medium mb-1">{t('documents.analysisTime')}</h4>
                  <p className="text-center text-sm">{results.analysisTime} {t('documents.seconds')}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl text-center text-primary mb-2">
                    <i className="ri-file-list-3-line"></i>
                  </div>
                  <h4 className="text-center font-medium mb-1">{t('documents.pageCount')}</h4>
                  <p className="text-center text-sm">{results.pageCount} {t('documents.pages')}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="keyInfo">
            <div className="space-y-4">
              {results.keyInformation.map((item: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h3 className="font-medium text-primary mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-700">{item.content}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="risks">
            <div className="space-y-4">
              {results.potentialRisks.map((risk: any, index: number) => (
                <Alert key={index} variant={risk.severity === 'high' ? 'destructive' : 'default'}>
                  <AlertTitle className="flex items-center">
                    {risk.severity === 'high' && <i className="ri-error-warning-line mr-2"></i>}
                    {risk.severity === 'medium' && <i className="ri-alert-line mr-2"></i>}
                    {risk.severity === 'low' && <i className="ri-information-line mr-2"></i>}
                    {risk.title}
                    <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-100">
                      {risk.severity.toUpperCase()}
                    </span>
                  </AlertTitle>
                  <AlertDescription>{risk.description}</AlertDescription>
                </Alert>
              ))}
              
              {results.potentialRisks.length === 0 && (
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
              {results.complianceChecks.map((check: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg flex">
                  <div className="mr-4">
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
                  <div>
                    <h3 className="font-medium text-primary mb-1">{check.requirement}</h3>
                    <p className="text-sm text-gray-700">{check.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentAnalysis;
