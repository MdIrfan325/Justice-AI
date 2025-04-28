import { Link } from "wouter";
import { format } from "date-fns";

interface NewsCardProps {
  title: string;
  summary: string;
  category: string;
  date: string;
  imageUrl: string;
  url: string;
}

const NewsCard = ({
  title,
  summary,
  category,
  date,
  imageUrl,
  url
}: NewsCardProps) => {
  const formattedDate = format(new Date(date), 'MMMM d, yyyy');
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-custom hover:shadow-lg">
      <div className="h-48 bg-gray-200 relative">
        <div 
          className="w-full h-full bg-cover bg-center" 
          style={{ backgroundImage: `url(${imageUrl})` }}
        ></div>
        <div className="absolute top-3 left-3 bg-highlight text-primary text-xs font-medium px-2 py-1 rounded-sm">
          {category}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-montserrat font-semibold text-primary text-lg mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-dark text-sm mb-3 line-clamp-3">{summary}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">{formattedDate}</span>
          <Link href={url} className="text-accent text-sm hover:underline">
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
