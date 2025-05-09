
import { Skill, Rating } from '@/types';
import { Slider } from '@/components/ui/slider';
import SkillRatingDot from '../SkillRatingDot';
import { Badge } from "@/components/ui/badge";

interface CollaboratorSkillItemProps {
  skill: Skill & { rating: Rating; isApt: boolean };
  onRatingChange: (skillId: string, rating: number[]) => void;
  updateSkillRating: (collaboratorId: string, skillId: string, rating: Rating) => void;
  toggleSkillAptitude: (collaboratorId: string, skillId: string) => void;
  collaboratorId: string;
  showAptitude: boolean;
}

const CollaboratorSkillItem: React.FC<CollaboratorSkillItemProps> = ({
  skill,
  onRatingChange,
  updateSkillRating,
  toggleSkillAptitude,
  collaboratorId,
  showAptitude
}) => {
  const getRatingSliderValue = (rating: Rating): number[] => {
    return rating === 'N/A' ? [0] : [rating];
  };

  // Get category badge variant
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'knowledge':
        return <Badge variant="outline">Conhecimento</Badge>;
      case 'hard':
        return <Badge variant="default">Hard Skill</Badge>;
      case 'soft':
        return <Badge variant="secondary">Soft Skill</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-all">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="font-medium">{skill.name}</div>
          {getCategoryBadge(skill.category)}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Slider
              value={getRatingSliderValue(skill.rating)}
              min={0}
              max={5}
              step={1}
              onValueChange={(value) => onRatingChange(skill.id, value)}
              className="w-full"
            />
            <div className="flex justify-between text-xs mt-1 text-muted-foreground">
              <span>N/A</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>
          <div className="flex items-center">
            <SkillRatingDot
              rating={skill.rating}
              isApt={skill.isApt}
              onRatingChange={(rating) => updateSkillRating(collaboratorId, skill.id, rating)}
              onAptToggle={() => toggleSkillAptitude(collaboratorId, skill.id)}
              showAptitude={showAptitude}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaboratorSkillItem;
