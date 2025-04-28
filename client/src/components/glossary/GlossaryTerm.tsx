import { Button } from "@/components/ui/button";

interface GlossaryTermProps {
  term: string;
  definition: string;
  category: string;
}

const GlossaryTerm = ({ term, definition, category }: GlossaryTermProps) => {
  return (
    <div className="border border-gray-100 rounded-lg p-4 hover:border-lavender transition-custom cursor-pointer">
      <h3 className="font-montserrat font-semibold text-primary">{term}</h3>
      <p className="text-dark text-sm mt-1">{definition}</p>
      <div className="flex justify-between items-center mt-3">
        <span className="bg-lavender px-2 py-1 rounded-sm text-xs text-primary">{category}</span>
        <Button 
          variant="link" 
          className="text-accent hover:underline text-sm p-0 h-auto"
        >
          <i className="ri-book-open-line mr-1"></i>
          <span>Learn more</span>
        </Button>
      </div>
    </div>
  );
};

export default GlossaryTerm;
