import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import NewsCard from "../news/NewsCard";

const NewsSection = () => {
  const { t } = useTranslation();
  
  const { data: news, isLoading } = useQuery({
    queryKey: ['/api/news/featured'],
  });

  return (
    <section className="mb-8">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-primary font-montserrat text-2xl font-bold">{t('newsSection.title')}</h2>
        <Link href="/news">
          <a className="text-accent flex items-center hover:underline">
            <span>{t('newsSection.viewAll')}</span>
            <i className="ri-arrow-right-line ml-1"></i>
          </a>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex flex-col">
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <Skeleton className="h-48 w-full mt-0.5 rounded-b-lg" />
            </div>
          ))
        ) : news?.length ? (
          news.map(item => (
            <NewsCard
              key={item.id}
              title={item.title}
              summary={item.summary}
              category={item.category}
              date={item.date}
              imageUrl={item.imageUrl}
              url={`/news/${item.id}`}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-8">
            <p className="text-gray-500">{t('newsSection.noNews')}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
