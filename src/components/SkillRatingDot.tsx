
import { useState } from 'react';
import { Rating } from '@/types';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CircleCheck, X } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface SkillRatingDotProps {
  rating: Rating;
  isApt: boolean;
  onRatingChange: (rating: Rating) => void;
  onAptToggle: () => void;
  showAptitude?: boolean;
}

const SkillRatingDot: React.FC<SkillRatingDotProps> = ({ 
  rating, 
  isApt, 
  onRatingChange, 
  onAptToggle,
  showAptitude = true
}) => {
  const [showSlider, setShowSlider] = useState(false);

  const ratingToValue = (rating: Rating): number => {
    if (rating === 'N/A') return 0;
    return rating;
  };

  const valueToRating = (value: number): Rating => {
    if (value === 0) return 'N/A';
    return value as Rating;
  };

  const handleSliderChange = (value: number[]) => {
    onRatingChange(valueToRating(value[0]));
  };

  const getRatingColor = (rating: Rating) => {
    switch (rating) {
      case 'N/A': return 'bg-skill-na';
      case 1: return 'bg-skill-level1';
      case 2: return 'bg-skill-level2';
      case 3: return 'bg-skill-level3';
      case 4: return 'bg-skill-level4';
      case 5: return 'bg-skill-level5';
    }
  };

  const getRatingText = (rating: Rating) => {
    switch (rating) {
      case 'N/A': return 'Não Aplicável';
      case 1: return 'Iniciante';
      case 2: return 'Básico';
      case 3: return 'Intermediário';
      case 4: return 'Avançado';
      case 5: return 'Especialista';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {!showSlider ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setShowSlider(true)}
              className={cn(
                'h-7 w-7 rounded-full flex items-center justify-center transition-all',
                getRatingColor(rating),
                'hover:ring-2 hover:ring-offset-1 hover:ring-skill-purple'
              )}
            >
              {typeof rating === 'number' && (
                <span className={cn(
                  'text-xs font-semibold',
                  (rating === 1 || rating === 5) ? 'text-white' : 'text-gray-800'
                )}>
                  {rating}
                </span>
              )}
              {rating === 'N/A' && <span className="text-xs font-semibold text-white">N/A</span>}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getRatingText(rating)}</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <div className="flex items-center space-x-2 bg-white p-2 rounded-md shadow-sm border w-32">
          <Slider
            defaultValue={[ratingToValue(rating)]}
            max={5}
            min={0}
            step={1}
            onValueChange={handleSliderChange}
            onValueCommit={() => setShowSlider(false)}
            className="w-24"
          />
          <span className="text-xs font-medium">
            {rating === 'N/A' ? 'N/A' : rating}
          </span>
        </div>
      )}

      {showAptitude && (
        <button onClick={onAptToggle} className="text-gray-600 hover:text-skill-purple">
          {isApt ? (
            <CircleCheck size={18} className="text-skill-level5" />
          ) : (
            <X size={18} className="text-gray-400" />
          )}
        </button>
      )}
    </div>
  );
};

export default SkillRatingDot;
