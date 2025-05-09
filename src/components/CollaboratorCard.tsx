
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Collaborator } from '@/types';
import { useMatrix } from '@/context/MatrixContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CollaboratorHeader } from './collaborator/CollaboratorHeader';
import CollaboratorSkillsSection from './collaborator/CollaboratorSkillsSection';
import { badgeVariants } from './ui/badge';

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

  // For the collapsed view, we create a simplified summary
  const renderCollapsedSkillMatrix = () => {
    if (assignedSkills.length === 0) {
      return <p className="text-sm text-gray-500">Nenhuma habilidade atribuída</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
        {assignedSkills.map(skill => (
          <div key={skill.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
            <div className="flex items-center">
              <span className={
                skill.category === 'knowledge' ? badgeVariants({ variant: "outline" }) :
                skill.category === 'hard' ? badgeVariants({ variant: "default" }) :
                badgeVariants({ variant: "secondary" })
              }>
                {skill.category === 'knowledge' ? 'K' : skill.category === 'hard' ? 'H' : 'S'}
              </span>
              <span className="ml-2 text-sm">{skill.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
                skill.rating === 'N/A' ? 'bg-gray-200' :
                skill.rating === 1 ? 'bg-red-400 text-white' : 
                skill.rating === 2 ? 'bg-orange-400 text-white' : 
                skill.rating === 3 ? 'bg-yellow-400' : 
                skill.rating === 4 ? 'bg-green-400' : 
                'bg-green-600 text-white'
              }`}>
                {skill.rating === 'N/A' ? '-' : skill.rating}
              </span>
              {skill.isApt && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
            </div>
          </div>
        ))}
      </div>
    );
  };

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
          
          {isCollapsed ? (
            <div className="py-2">
              {renderCollapsedSkillMatrix()}
            </div>
          ) : (
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
          )}
        </Collapsible>
      </CardHeader>
    </Card>
  );
};

export default CollaboratorCard;
