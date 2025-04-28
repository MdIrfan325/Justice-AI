import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import ExpertCard from "../experts/ExpertCard";

const ExpertDirectoryPreview = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [location, setLocation] = useState("all");
  
  const { data: experts, isLoading } = useQuery({
    queryKey: ['/api/experts/featured'],
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
    <section className="mb-8">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-primary font-montserrat text-2xl font-bold">{t('expertDirectory.title')}</h2>
        <Link href="/experts">
          <a className="text-accent flex items-center hover:underline">
            <span>{t('expertDirectory.viewAll')}</span>
            <i className="ri-arrow-right-line ml-1"></i>
          </a>
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Input
              type="text"
              className="w-full pl-10 pr-4 py-3"
              placeholder={t('expertDirectory.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          
          <div className="flex gap-4">
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('expertDirectory.allSpecialties')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('expertDirectory.allSpecialties')}</SelectItem>
                {specialties?.map(spec => (
                  <SelectItem key={spec.id} value={spec.value}>
                    {spec.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('expertDirectory.allLocations')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('expertDirectory.allLocations')}</SelectItem>
                {locations?.map(loc => (
                  <SelectItem key={loc.id} value={loc.value}>
                    {loc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Experts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))
          ) : filteredExperts?.length ? (
            filteredExperts.slice(0, 3).map(expert => (
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
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-500">{t('expertDirectory.noExpertsFound')}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ExpertDirectoryPreview;
