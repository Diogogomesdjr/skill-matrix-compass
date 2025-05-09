
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flag, UserMinus, ChevronDown, ChevronUp } from 'lucide-react';
import { Collaborator } from '@/types';
import SkillRatingDot from './SkillRatingDot';
import { useMatrix } from '@/context/MatrixContext';
import SkillRadarChart from './SkillRadarChart';
import { toast } from 'sonner';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CollaboratorCardProps {
  collaborator: Collaborator;
}

const CollaboratorCard: React.FC<CollaboratorCardProps> = ({ collaborator }) => {
  const { skills, teams, updateSkillRating, toggleSkillAptitude, toggleFocal, removeCollaborator } = useMatrix();
  const [showRadar, setShowRadar] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const handleRemove = () => {
    removeCollaborator(collaborator.id);
    toast.success(`${collaborator.name} foi removido com sucesso.`);
  };

  const handleToggleFocal = () => {
    toggleFocal(collaborator.id);
    toast.success(
      collaborator.isFocal
        ? `${collaborator.name} não é mais o Ponto Focal.`
        : `${collaborator.name} definido como Ponto Focal.`
    );
  };

  const handleRatingChange = (skillId: string, rating: number[]) => {
    const newRating = rating[0] === 0 ? 'N/A' : rating[0] as 1 | 2 | 3 | 4 | 5;
    updateSkillRating(collaborator.id, skillId, newRating);
  };

  const getRatingSliderValue = (rating: 'N/A' | 1 | 2 | 3 | 4 | 5): number[] => {
    return rating === 'N/A' ? [0] : [rating];
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
                  <Flag size={18} className="text-skill-purple" aria-label="Ponto Focal" />
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
              {collaborator.isFocal ? 'Remover Ponto Focal' : 'Definir como Ponto Focal'}
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
            {assignedSkills.length > 0 && !isCollapsed && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRadar(!showRadar)}
              >
                {showRadar ? 'Esconder Gráfico' : 'Mostrar Gráfico'}
              </Button>
            )}
          </div>
          
          <CollapsibleContent>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="space-y-6">
                    {/* Knowledge Skills */}
                    {knowledgeSkills.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-3">Conhecimentos</h3>
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                          <div className="grid grid-cols-1 gap-4">
                            {knowledgeSkills.map(skill => (
                              <div key={skill.id} className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-all">
                                <div className="flex flex-col gap-2">
                                  <div className="font-medium">{skill.name}</div>
                                  <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                      <Slider
                                        value={getRatingSliderValue(skill.rating)}
                                        min={0}
                                        max={5}
                                        step={1}
                                        onValueChange={(value) => handleRatingChange(skill.id, value)}
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
                                        onRatingChange={(rating) => updateSkillRating(collaborator.id, skill.id, rating)}
                                        onAptToggle={() => toggleSkillAptitude(collaborator.id, skill.id)}
                                        showAptitude={true}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Hard & Soft Skills */}
                    {assignedSkills.filter(s => s.category !== 'knowledge').length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-3">Habilidades</h3>
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                          <div className="grid grid-cols-1 gap-4">
                            {assignedSkills
                              .filter(skill => skill.category !== 'knowledge')
                              .map(skill => (
                                <div key={skill.id} className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-all">
                                  <div className="flex flex-col gap-2">
                                    <div className="font-medium">{skill.name}</div>
                                    <div className="flex items-center gap-4">
                                      <div className="flex-1">
                                        <Slider
                                          value={getRatingSliderValue(skill.rating)}
                                          min={0}
                                          max={5}
                                          step={1}
                                          onValueChange={(value) => handleRatingChange(skill.id, value)}
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
                                      <div>
                                        <SkillRatingDot
                                          rating={skill.rating}
                                          isApt={skill.isApt}
                                          onRatingChange={(rating) => updateSkillRating(collaborator.id, skill.id, rating)}
                                          onAptToggle={() => toggleSkillAptitude(collaborator.id, skill.id)}
                                          showAptitude={false}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {assignedSkills.length === 0 && (
                      <div className="bg-white rounded-lg p-6 text-center text-gray-500 border border-dashed border-gray-200">
                        Nenhuma habilidade atribuída a este colaborador
                      </div>
                    )}
                  </div>
                </div>
                {showRadar && assignedSkills.length > 0 && (
                  <div className="flex-1 min-h-[300px]">
                    <SkillRadarChart collaborator={collaborator} />
                  </div>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </CardHeader>
    </Card>
  );
};

export default CollaboratorCard;
