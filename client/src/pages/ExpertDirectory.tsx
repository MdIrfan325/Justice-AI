import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ExpertCard from "../components/experts/ExpertCard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ExpertDirectory = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [location, setLocation] = useState("all");
  
  const { data: experts, isLoading } = useQuery({
    queryKey: ['/api/experts', specialty, location],
  });
  
  const { data: specialties } = useQuery({
    queryKey: ['/api/experts/specialties'],
  });
  
  const { data: locations } = useQuery({
    queryKey: ['/api/experts/locations'],
  });
  
  const filteredExperts = experts?.filter(expert => 
    expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-primary font-montserrat text-3xl font-bold mb-4">{t('experts.title')}</h1>
        <p className="text-gray-600 mb-6">{t('experts.description')}</p>
      </div>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Input
                type="text"
                className="w-full pl-10 pr-4 py-3"
                placeholder={t('experts.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            
            <div className="flex gap-4">
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('experts.allSpecialties')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('experts.allSpecialties')}</SelectItem>
                  {specialties?.map(spec => (
                    <SelectItem key={spec.id} value={spec.value}>
                      {spec.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('experts.allLocations')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('experts.allLocations')}</SelectItem>
                  {locations?.map(loc => (
                    <SelectItem key={loc.id} value={loc.value}>
                      {loc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="h-64 w-full rounded-lg" />
              ))}
            </div>
          ) : filteredExperts && filteredExperts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExperts.map(expert => (
                <ExpertCard
                  key={expert.id}
                  name={expert.name}
                  specialty={expert.specialty}
                  location={expert.location}
                  experience={expert.experience}
                  rating={expert.rating}
                  reviewCount={expert.reviewCount}
                  courts={expert.courts}
                  initials={expert.initials}
                  colorScheme={expert.colorScheme}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">
                <i className="ri-user-search-line text-gray-300"></i>
              </div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">{t('experts.noExpertsFound')}</h3>
              <p className="text-gray-500">{t('experts.tryDifferentFilters')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpertDirectory;
