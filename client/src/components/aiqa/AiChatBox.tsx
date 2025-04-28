import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";

interface Message {
  type: 'user' | 'ai';
  text: string;
  citations?: string;
}

interface AiChatBoxProps {
  messages: Message[];
  isLoading: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const AiChatBox = ({
  messages,
  isLoading,
  inputValue,
  setInputValue,
  onSubmit
}: AiChatBoxProps) => {
  const { t } = useTranslation();

  return (
    <Card className="h-[600px] flex flex-col">
      <CardContent className="p-0 flex-grow flex flex-col">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="text-5xl mb-6 text-primary opacity-20">
              <i className="ri-robot-line"></i>
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">{t('aiQA.welcome')}</h3>
            <p className="text-sm text-gray-500 max-w-md">{t('aiQA.askAnything')}</p>
          </div>
        ) : (
          <ScrollArea className="flex-grow p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`rounded-lg p-4 max-w-[85%] ${
                    message.type === 'user' 
                      ? 'bg-lavender ml-auto' 
                      : 'bg-mint'
                  }`}
                >
                  <div className="flex items-start">
                    {message.type === 'ai' && (
                      <i className="ri-robot-line mr-2 text-primary pt-1 shrink-0"></i>
                    )}
                    <div className="overflow-hidden">
                      <p className="text-dark text-sm break-words whitespace-pre-wrap">{message.text}</p>
                      {message.citations && (
                        <p className="text-xs text-primary mt-2 break-words">{message.citations}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="rounded-lg p-4 max-w-[85%] bg-mint">
                  <div className="flex items-center space-x-2">
                    <i className="ri-robot-line text-primary"></i>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" 
                        style={{animationDelay: '0ms'}}></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" 
                        style={{animationDelay: '150ms'}}></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" 
                        style={{animationDelay: '300ms'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
        
        <form onSubmit={onSubmit} className="p-4 border-t">
          <div className="relative">
            <Input 
              type="text"
              className="pl-4 pr-12 py-3"
              placeholder={t('aiQA.inputPlaceholder')}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-accent"
              disabled={isLoading || !inputValue.trim()}
            >
              <i className="ri-send-plane-fill"></i>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AiChatBox;
