
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skill, Rating, Collaborator } from '@/types';
import SkillRadarChart from '../SkillRadarChart';
import CollaboratorSkillsGroup from './CollaboratorSkillsGroup';

interface CollaboratorSkillsSectionProps {
  skills: Array<Skill & { rating: Rating; isApt: boolean }>;
  knowledgeSkills: Array<Skill & { rating: Rating; isApt: boolean }>;
  otherSkills: Array<Skill & { rating: Rating; isApt: boolean }>;
  collaborator: Collaborator;
  updateSkillRating: (collaboratorId: string, skillId: string, rating: Rating) => void;
  toggleSkillAptitude: (collaboratorId: string, skillId: string) => void;
}

const CollaboratorSkillsSection: React.FC<CollaboratorSkillsSectionProps> = ({
  skills,
  knowledgeSkills,
  otherSkills,
  collaborator,
  updateSkillRating,
  toggleSkillAptitude
}) => {
  const [showRadar, setShowRadar] = useState(false);

  const handleRatingChange = (skillId: string, rating: number[]) => {
    const newRating = rating[0] === 0 ? 'N/A' : rating[0] as 1 | 2 | 3 | 4 | 5;
    updateSkillRating(collaborator.id, skillId, newRating);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <div className="space-y-6">
          <CollaboratorSkillsGroup 
            title="Conhecimentos"
            skills={knowledgeSkills}
            onRatingChange={handleRatingChange}
            updateSkillRating={updateSkillRating}
            toggleSkillAptitude={toggleSkillAptitude}
            collaboratorId={collaborator.id}
            showAptitude={true}
          />

          <CollaboratorSkillsGroup 
            title="Habilidades"
            skills={otherSkills}
            onRatingChange={handleRatingChange}
            updateSkillRating={updateSkillRating}
            toggleSkillAptitude={toggleSkillAptitude}
            collaboratorId={collaborator.id}
            showAptitude={false}
          />

          {skills.length === 0 && (
            <div className="bg-white rounded-lg p-6 text-center text-gray-500 border border-dashed border-gray-200">
              Nenhuma habilidade atribuída a este colaborador
            </div>
          )}
        </div>
      </div>
      
      {showRadar && skills.length > 0 && (
        <div className="flex-1 min-h-[300px]">
          <SkillRadarChart collaborator={collaborator} />
        </div>
      )}
      
      {skills.length > 0 && (
        <div className="flex justify-end mt-4 md:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRadar(!showRadar)}
          >
            {showRadar ? 'Esconder Gráfico' : 'Mostrar Gráfico'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CollaboratorSkillsSection;
