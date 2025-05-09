
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skill, Rating, Collaborator } from '@/types';
import SkillRadarChart from '../SkillRadarChart';
import CollaboratorSkillsGroup from './CollaboratorSkillsGroup';
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { useMatrix } from '@/context/MatrixContext';
import { Plus } from 'lucide-react';

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
  const [openSkillDialog, setOpenSkillDialog] = useState(false);
  const { skills: allSkills } = useMatrix();

  // Calculate aptitude status
  const aptSkills = collaborator.skills.filter(skill => skill.isApt).length;
  const totalSkills = collaborator.skills.length;
  const aptPercentage = totalSkills > 0 ? (aptSkills / totalSkills) * 100 : 0;
  
  const getAptitudeStatus = () => {
    if (aptPercentage >= 75) {
      return { label: 'Apto para Reconhecimento', color: 'bg-green-100 text-green-800' };
    } else if (aptPercentage >= 50) {
      return { label: 'Em Desenvolvimento', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { label: 'Precisa de Atenção', color: 'bg-red-100 text-red-800' };
    }
  };

  const aptitudeStatus = getAptitudeStatus();

  // Separate hard and soft skills
  const hardSkills = otherSkills.filter(skill => skill.category === 'hard');
  const softSkills = otherSkills.filter(skill => skill.category === 'soft');

  const handleRatingChange = (skillId: string, rating: number[]) => {
    const newRating = rating[0] === 0 ? 'N/A' : rating[0] as 1 | 2 | 3 | 4 | 5;
    updateSkillRating(collaborator.id, skillId, newRating);
  };

  // Get skills that are not already assigned to collaborator
  const unassignedSkills = allSkills.filter(
    skill => !collaborator.skills.some(cs => cs.skillId === skill.id)
  );

  const addSkillToCollaborator = (skillId: string) => {
    updateSkillRating(collaborator.id, skillId, 'N/A');
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${aptitudeStatus.color}`}>
              {aptitudeStatus.label} ({Math.round(aptPercentage)}%)
            </div>
          </div>
          
          <Dialog open={openSkillDialog} onOpenChange={setOpenSkillDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2" variant="outline">
                <Plus size={18} />
                Adicionar Habilidades
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Habilidades para {collaborator.name}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                {unassignedSkills.length > 0 ? (
                  unassignedSkills.map(skill => (
                    <div key={skill.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <div className="flex items-center gap-2">
                        <Badge variant={skill.category === 'knowledge' ? 'outline' : skill.category === 'hard' ? 'default' : 'secondary'}>
                          {skill.category === 'knowledge' ? 'Conhecimento' : 
                           skill.category === 'hard' ? 'Hard Skill' : 'Soft Skill'}
                        </Badge>
                        <span>{skill.name}</span>
                      </div>
                      <Button 
                        onClick={() => {
                          addSkillToCollaborator(skill.id);
                          setOpenSkillDialog(false);
                        }}
                        size="sm"
                      >
                        Adicionar
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4 text-muted-foreground">
                    Todas as habilidades já foram atribuídas a este colaborador.
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-6">
          <CollaboratorSkillsGroup 
            title="Conhecimentos"
            skills={knowledgeSkills}
            onRatingChange={handleRatingChange}
            updateSkillRating={updateSkillRating}
            toggleSkillAptitude={toggleSkillAptitude}
            collaboratorId={collaborator.id}
            showAptitude={true}
            categoryLabel="Knowledge"
          />

          <CollaboratorSkillsGroup 
            title="Hard Skills"
            skills={hardSkills}
            onRatingChange={handleRatingChange}
            updateSkillRating={updateSkillRating}
            toggleSkillAptitude={toggleSkillAptitude}
            collaboratorId={collaborator.id}
            showAptitude={true}
          />

          <CollaboratorSkillsGroup 
            title="Soft Skills"
            skills={softSkills}
            onRatingChange={handleRatingChange}
            updateSkillRating={updateSkillRating}
            toggleSkillAptitude={toggleSkillAptitude}
            collaboratorId={collaborator.id}
            showAptitude={true}
          />

          {skills.length === 0 && (
            <div className="bg-white rounded-lg p-6 text-center text-gray-500 border border-dashed border-gray-200">
              Nenhuma habilidade atribuída a este colaborador
            </div>
          )}
        </div>
      </div>
      
      {showRadar && skills.length > 0 && (
        <div className="flex-1 min-h-[350px]">
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
