import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import AiChatBox from "../components/aiqa/AiChatBox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AiQA = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Array<{
    type: 'user' | 'ai';
    text: string;
    citations?: string;
  }>>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const userMessage = { type: 'user' as const, text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: inputValue }),
      });
      
      if (!response.ok) throw new Error('Failed to get AI response');
      
      const data = await response.json();
      setMessages(prev => [...prev, { 
        type: 'ai' as const, 
        text: data.response,
        citations: data.citations 
      }]);
    } catch (error) {
      console.error('Error in AI response:', error);
      setMessages(prev => [...prev, { 
        type: 'ai' as const, 
        text: t('aiQA.errorMessage')
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-primary font-montserrat text-3xl font-bold mb-4">{t('aiQA.title')}</h1>
        <p className="text-gray-600 mb-6">{t('aiQA.description')}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <AiChatBox 
            messages={messages}
            isLoading={isLoading}
            inputValue={inputValue}
            setInputValue={setInputValue}
            onSubmit={handleSubmit}
          />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">{t('aiQA.suggestedTopics')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {['aiQA.topic1', 'aiQA.topic2', 'aiQA.topic3', 'aiQA.topic4'].map((topicKey, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  className="w-full justify-start text-left"
                  onClick={() => setInputValue(t(topicKey))}
                >
                  {t(topicKey)}
                </Button>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">{t('aiQA.about')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">{t('aiQA.aboutDescription')}</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <i className="ri-check-line text-accent text-lg mr-2"></i>
                  <span>{t('aiQA.feature1')}</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-accent text-lg mr-2"></i>
                  <span>{t('aiQA.feature2')}</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-accent text-lg mr-2"></i>
                  <span>{t('aiQA.feature3')}</span>
                </li>
              </ul>
              <div className="mt-4 text-xs text-gray-500">
                <p>{t('aiQA.disclaimer')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AiQA;
