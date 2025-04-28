import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploaderProps {
  onDocumentUploaded: (documentId: string | number) => void;
}

const DocumentUploader = ({ onDocumentUploaded }: DocumentUploaderProps) => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };
  
  const validateAndSetFile = (file: File) => {
    // Accept only PDF, DOCX, and TXT files
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: t('documents.invalidFileType'),
        description: t('documents.allowedFileTypes'),
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: t('documents.fileTooLarge'),
        description: t('documents.maxFileSize'),
        variant: "destructive"
      });
      return;
    }
    
    setFile(file);
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    console.log(`Attempting to upload file: ${file.name} (${file.type}, ${file.size} bytes)`);
    
    try {
      const formData = new FormData();
      formData.append('document', file);
      
      // Use a standard fetch for FormData uploads
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type with FormData - browser handles it automatically
      });
      
      let errorMessage;
      let responseData;
      
      try {
        // Try to parse JSON response whether successful or not
        const responseText = await response.text();
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          // If not valid JSON, use raw text
          console.error('Response is not valid JSON:', responseText);
          responseData = { message: responseText };
        }
      } catch (e) {
        console.error('Error reading response:', e);
        responseData = { message: 'Could not read server response' };
      }
      
      if (!response.ok) {
        errorMessage = responseData?.message || response.statusText || t('documents.uploadError');
        throw new Error(errorMessage);
      }
      
      console.log('Upload successful:', responseData);
      
      if (!responseData?.documentId) {
        throw new Error(t('documents.missingDocumentId'));
      }
      
      toast({
        title: t('documents.uploadSuccess'),
        description: t('documents.proceedToAnalysis'),
      });
      
      onDocumentUploaded(responseData.documentId);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: t('documents.uploadError'),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div 
          className={`border-2 border-dashed rounded-lg p-6 md:p-8 mb-6 text-center transition-all cursor-pointer hover:border-primary hover:bg-gray-50 ${
            isDragging 
              ? 'border-primary bg-secondary/20 shadow-inner' 
              : file 
                ? 'border-green-500 bg-green-50/50' 
                : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="space-y-3">
              <div className="text-3xl text-green-500 mb-2">
                <i className="ri-file-check-line"></i>
              </div>
              <h3 className="text-lg font-medium">{t('documents.fileSelected')}</h3>
              <p className="text-sm">{file.name} ({(file.size / 1024).toFixed(1)} KB)</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-5xl text-gray-300 mb-2">
                <i className="ri-file-upload-line"></i>
              </div>
              <h3 className="text-lg font-medium">{t('documents.dragAndDrop')}</h3>
              <p className="text-sm text-gray-500 mb-4">{t('documents.allowedFileFormats')}</p>
              
              <div>
                <label htmlFor="document-file-input" className="cursor-pointer">
                  <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                    <i className="ri-folder-open-line mr-2"></i>
                    {t('documents.browseFiles')}
                  </div>
                </label>
                <input 
                  id="document-file-input"
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="text-center">
          <Button 
            disabled={!file || isUploading} 
            className="bg-accent hover:bg-accent/90 text-white transition-custom px-8 font-medium"
            onClick={handleUpload}
          >
            {isUploading ? (
              <>
                <div className="mr-2 animate-spin">
                  <i className="ri-loader-4-line"></i>
                </div>
                {t('documents.uploading')}
              </>
            ) : (
              <>
                <i className="ri-upload-cloud-line mr-2"></i>
                {t('documents.upload')}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUploader;
