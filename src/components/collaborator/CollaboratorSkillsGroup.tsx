
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
}

const CollaboratorSkillsGroup: React.FC<CollaboratorSkillsGroupProps> = ({
  title,
  skills,
  onRatingChange,
  updateSkillRating,
  toggleSkillAptitude,
  collaboratorId,
  showAptitude
}) => {
  if (skills.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">{title}</h3>
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
