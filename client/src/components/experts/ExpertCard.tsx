import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ExpertCardProps {
  name: string;
  specialty: string;
  location: string;
  experience: string;
  rating: number;
  reviewCount: number;
  courts: string[];
  initials: string;
  colorScheme: 'lavender' | 'mint';
}

const ExpertCard = ({
  name,
  specialty,
  location,
  experience,
  rating,
  reviewCount,
  courts,
  initials,
  colorScheme
}: ExpertCardProps) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="ri-star-fill text-highlight mr-1"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="ri-star-half-fill text-highlight mr-1"></i>);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<i key={`empty-${i}`} className="ri-star-line text-highlight mr-1"></i>);
    }
    
    return stars;
  };

  return (
    <div className="border border-gray-100 rounded-lg p-5 hover:border-lavender transition-custom">
      <div className="flex items-center mb-4">
        <Avatar className={`h-16 w-16 bg-${colorScheme} bg-opacity-50 mr-3`}>
          <AvatarFallback className="text-primary font-montserrat font-semibold text-xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-montserrat font-semibold text-primary">{name}</h3>
          <p className="text-accent text-sm">{specialty}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center mb-1">
          <i className="ri-map-pin-line text-gray-400 mr-2"></i>
          <span className="text-sm">{location}</span>
        </div>
        <div className="flex items-center mb-1">
          <i className="ri-scales-3-line text-gray-400 mr-2"></i>
          <span className="text-sm">{experience}</span>
        </div>
        <div className="flex items-center">
          {renderStars(rating)}
          <span className="text-sm text-gray-500">({reviewCount} reviews)</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {courts.map((court, index) => (
          <span 
            key={index} 
            className={`bg-${colorScheme} bg-opacity-50 px-2 py-1 rounded-sm text-xs text-primary`}
          >
            {court}
          </span>
        ))}
      </div>
      
      <Button className="w-full bg-primary hover:bg-opacity-90 text-white py-2 rounded-lg text-sm transition-custom h-auto">
        View Profile
      </Button>
    </div>
  );
};

export default ExpertCard;
