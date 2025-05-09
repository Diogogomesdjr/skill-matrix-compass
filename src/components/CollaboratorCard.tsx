
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Collaborator } from '@/types';
import { useMatrix } from '@/context/MatrixContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CollaboratorHeader } from './collaborator/CollaboratorHeader';
import CollaboratorSkillsSection from './collaborator/CollaboratorSkillsSection';

interface CollaboratorCardProps {
  collaborator: Collaborator;
}

const CollaboratorCard: React.FC<CollaboratorCardProps> = ({ collaborator }) => {
  const { skills, teams, updateSkillRating, toggleSkillAptitude, toggleFocal, removeCollaborator } = useMatrix();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Get only skills that were assigned to the collaborator
  const assignedSkills = skills
    .filter(skill => collaborator.skills.some(s => s.skillId === skill.id))
    .map(skill => {
      const skillRating = collaborator.skills.find(s => s.skillId === skill.id);
      return {
        ...skill,
        rating: skillRating?.rating || 'N/A',
        isApt: skillRating?.isApt || false,
      };
    });

  // Group skills by category
  const knowledgeSkills = assignedSkills.filter(skill => skill.category === 'knowledge');
  const otherSkills = assignedSkills.filter(skill => skill.category !== 'knowledge');

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CollaboratorHeader 
          collaborator={collaborator}
          teams={teams}
          toggleFocal={toggleFocal}
          removeCollaborator={removeCollaborator}
        />
        
        <Collapsible
          open={!isCollapsed}
          onOpenChange={(open) => setIsCollapsed(!open)}
          className="mt-4"
        >
          <div className="flex justify-between items-center">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                {isCollapsed ? (
                  <>
                    <ChevronDown size={16} />
                    Expandir Matriz
                  </>
                ) : (
                  <>
                    <ChevronUp size={16} />
                    Recolher Matriz
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent>
            <CardContent>
              <CollaboratorSkillsSection 
                skills={assignedSkills}
                knowledgeSkills={knowledgeSkills}
                otherSkills={otherSkills}
                collaborator={collaborator}
                updateSkillRating={updateSkillRating}
                toggleSkillAptitude={toggleSkillAptitude}
              />
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </CardHeader>
    </Card>
  );
};

export default CollaboratorCard;
