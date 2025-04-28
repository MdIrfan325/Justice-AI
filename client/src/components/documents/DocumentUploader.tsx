import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploaderProps {
  onDocumentUploaded: (documentId: string) => void;
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
    
    try {
      const formData = new FormData();
      formData.append('document', file);
      
      // Use XMLHttpRequest instead of fetch for better file upload handling
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/documents/upload', true);

      // Set up progress tracking if needed
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          console.log(`Upload progress: ${progress}%`);
        }
      };
      
      // Promise to handle the XHR request
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve(data);
            } catch (e) {
              reject(new Error('Invalid JSON response'));
            }
          } else {
            reject(new Error(`Upload failed: ${xhr.statusText}`));
          }
        };
        xhr.onerror = () => reject(new Error('Network error occurred'));
      });
      
      // Start the upload
      xhr.send(formData);
      
      // Wait for the upload to complete
      const data = await uploadPromise as {documentId: string};
      
      toast({
        title: t('documents.uploadSuccess'),
        description: t('documents.proceedToAnalysis'),
      });
      
      onDocumentUploaded(data.documentId);
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
          className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center transition-colors ${
            isDragging 
              ? 'border-primary bg-lavender bg-opacity-20' 
              : file 
                ? 'border-green-500 bg-green-50' 
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
                <label className="inline-block cursor-pointer">
                  <Button variant="outline">
                    <i className="ri-upload-line mr-2"></i>
                    {t('documents.browseFiles')}
                  </Button>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
          )}
        </div>
        
        <div className="text-center">
          <Button 
            disabled={!file || isUploading} 
            className="bg-accent hover:bg-opacity-90 text-white rounded-lg transition-custom px-8"
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
