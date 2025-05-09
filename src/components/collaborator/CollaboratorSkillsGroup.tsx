
import { Skill, Rating } from '@/types';
import CollaboratorSkillItem from './CollaboratorSkillItem';

interface CollaboratorSkillsGroupProps {
  title: string;
  skills: Array<Skill & { rating: Rating; isApt: boolean }>;
  onRatingChange: (skillId: string, rating: number[]) => void;
  updateSkillRating: (collaboratorId: string, skillId: string, rating: Rating) => void;
  toggleSkillAptitude: (collaboratorId: string, skillId: string) => void;
  collaboratorId: string;
  showAptitude: boolean;
  categoryLabel?: string;
}

const CollaboratorSkillsGroup: React.FC<CollaboratorSkillsGroupProps> = ({
  title,
  skills,
  onRatingChange,
  updateSkillRating,
  toggleSkillAptitude,
  collaboratorId,
  showAptitude,
  categoryLabel
}) => {
  if (skills.length === 0) return null;

  const getCategoryLabel = () => {
    if (categoryLabel) return categoryLabel;
    if (title === "Hard Skills") return "Hard";
    if (title === "Soft Skills") return "Soft";
    return "Knowledge";
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">
        {title}
        <span className="ml-2 text-sm text-gray-500">({getCategoryLabel()})</span>
      </h3>
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 gap-4">
          {skills.map(skill => (
            <CollaboratorSkillItem
              key={skill.id}
              skill={skill}
              onRatingChange={onRatingChange}
              updateSkillRating={updateSkillRating}
              toggleSkillAptitude={toggleSkillAptitude}
              collaboratorId={collaboratorId}
              showAptitude={showAptitude}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollaboratorSkillsGroup;
