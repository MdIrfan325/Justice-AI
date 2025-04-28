import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NewsCard from "../components/news/NewsCard";
import { Skeleton } from "@/components/ui/skeleton";

const News = () => {
  const { t } = useTranslation();
  const [category, setCategory] = useState("all");
  
  const { data: news, isLoading } = useQuery({
    queryKey: ['/api/news', category],
  });

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-end mb-6">
        <h1 className="text-primary font-montserrat text-3xl font-bold">{t('news.title')}</h1>
        
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('news.categoryFilter')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('news.allCategories')}</SelectItem>
            <SelectItem value="supreme-court">{t('news.supremeCourt')}</SelectItem>
            <SelectItem value="high-court">{t('news.highCourt')}</SelectItem>
            <SelectItem value="legislation">{t('news.legislation')}</SelectItem>
            <SelectItem value="international">{t('news.international')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex flex-col">
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <Skeleton className="h-48 w-full mt-0.5 rounded-b-lg" />
            </div>
          ))}
        </div>
      ) : news && news.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map(item => (
            <NewsCard
              key={item.id}
              title={item.title}
              summary={item.summary}
              category={item.category}
              date={item.date}
              imageUrl={item.imageUrl}
              url={item.url}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">
            <i className="ri-newspaper-line text-gray-300"></i>
          </div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">{t('news.noNews')}</h3>
          <p className="text-gray-500">{t('news.checkBackLater')}</p>
        </div>
      )}
    </div>
  );
};

export default News;
