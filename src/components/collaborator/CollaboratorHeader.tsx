
import { Flag, UserMinus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collaborator, Team } from '@/types';
import { toast } from 'sonner';

interface CollaboratorHeaderProps {
  collaborator: Collaborator;
  teams: Team[];
  toggleFocal: (id: string) => void;
  removeCollaborator: (id: string) => void;
}

export const CollaboratorHeader: React.FC<CollaboratorHeaderProps> = ({
  collaborator,
  teams,
  toggleFocal,
  removeCollaborator,
}) => {
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

  return (
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
  );
};
