
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flag, UserMinus, Star } from 'lucide-react';
import { Collaborator, Skill, Team } from '@/types';
import SkillRatingDot from './SkillRatingDot';
import { useMatrix } from '@/context/MatrixContext';
import SkillRadarChart from './SkillRadarChart';
import { toast } from 'sonner';

interface CollaboratorCardProps {
  collaborator: Collaborator;
}

const CollaboratorCard: React.FC<CollaboratorCardProps> = ({ collaborator }) => {
  const { skills, teams, updateSkillRating, toggleSkillAptitude, toggleFocal, removeCollaborator } = useMatrix();
  const [showRadar, setShowRadar] = useState(false);

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : 'Sem equipe';
  };

  const getCollaboratorInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Obter apenas as habilidades que foram atribuídas ao colaborador
  const getAssignedSkills = (category: 'hard' | 'soft') => {
    const assignedSkillIds = collaborator.skills.map(s => s.skillId);
    
    return skills
      .filter(skill => 
        skill.category === category && 
        assignedSkillIds.includes(skill.id)
      )
      .map(skill => ({
        ...skill,
        rating: collaborator.skills.find(s => s.skillId === skill.id)?.rating || 'N/A',
        isApt: collaborator.skills.find(s => s.skillId === skill.id)?.isApt || false,
      }));
  };

  const hardSkills = getAssignedSkills('hard');
  const softSkills = getAssignedSkills('soft');

  const handleRemove = () => {
    removeCollaborator(collaborator.id);
    toast.success(`${collaborator.name} foi removido com sucesso.`);
  };

  const handleToggleFocal = () => {
    toggleFocal(collaborator.id);
    toast.success(
      collaborator.isFocal
        ? `${collaborator.name} não é mais o responsável.`
        : `${collaborator.name} definido como responsável.`
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16 border-2 border-gray-200">
              <AvatarImage src={collaborator.photo} />
              <AvatarFallback>{getCollaboratorInitials(collaborator.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="flex items-center gap-2">
                {collaborator.name}
                {collaborator.isFocal && (
                  <Flag size={18} className="text-skill-purple" />
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{getTeamName(collaborator.teamId)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
              onClick={handleToggleFocal}
            >
              <Flag size={16} />
              {collaborator.isFocal ? 'Remover responsável' : 'Tornar responsável'}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleRemove}
            >
              <UserMinus size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="space-y-6">
              {/* Hard Skills Matrix */}
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  Hard Skills
                  {hardSkills.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2"
                      onClick={() => setShowRadar(!showRadar)}
                    >
                      {showRadar ? 'Esconder Gráfico' : 'Mostrar Gráfico'}
                    </Button>
                  )}
                </h3>
                {hardSkills.length > 0 ? (
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {hardSkills.map(skill => (
                        <div key={skill.id} className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-all">
                          <div className="flex flex-col gap-2">
                            <div className="font-medium text-sm line-clamp-2 min-h-[40px]">{skill.name}</div>
                            <div className="flex justify-between items-center">
                              <SkillRatingDot
                                rating={skill.rating}
                                isApt={skill.isApt}
                                onRatingChange={(rating) => updateSkillRating(collaborator.id, skill.id, rating)}
                                onAptToggle={() => toggleSkillAptitude(collaborator.id, skill.id)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg p-6 text-center text-gray-500 border border-dashed border-gray-200">
                    Nenhuma hard skill atribuída a este colaborador
                  </div>
                )}
              </div>
              
              {/* Soft Skills Matrix */}
              <div>
                <h3 className="text-lg font-medium mb-3">Soft Skills</h3>
                {softSkills.length > 0 ? (
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {softSkills.map(skill => (
                        <div key={skill.id} className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-all">
                          <div className="flex flex-col gap-2">
                            <div className="font-medium text-sm line-clamp-2 min-h-[40px]">{skill.name}</div>
                            <div className="flex justify-between items-center">
                              <SkillRatingDot
                                rating={skill.rating}
                                isApt={skill.isApt}
                                onRatingChange={(rating) => updateSkillRating(collaborator.id, skill.id, rating)}
                                onAptToggle={() => toggleSkillAptitude(collaborator.id, skill.id)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg p-6 text-center text-gray-500 border border-dashed border-gray-200">
                    Nenhuma soft skill atribuída a este colaborador
                  </div>
                )}
              </div>
            </div>
          </div>
          {showRadar && hardSkills.length > 0 && (
            <div className="flex-1 min-h-[300px]">
              <SkillRadarChart collaborator={collaborator} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CollaboratorCard;
