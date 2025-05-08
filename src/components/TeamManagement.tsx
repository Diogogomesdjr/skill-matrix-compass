
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMatrix } from '@/context/MatrixContext';
import { toast } from 'sonner';
import AddTeamForm from './AddTeamForm';
import { Building } from 'lucide-react';

const TeamManagement: React.FC = () => {
  const { teams, removeTeam, collaborators } = useMatrix();
  const [openDialog, setOpenDialog] = useState(false);

  const handleRemoveTeam = (id: string, name: string) => {
    const teamHasCollaborators = collaborators.some(c => c.teamId === id);
    
    if (teamHasCollaborators) {
      toast.error(`Não é possível remover a equipe "${name}" pois existem colaboradores associados a ela.`);
      return;
    }
    
    removeTeam(id);
    toast.success(`Equipe "${name}" foi removida com sucesso.`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Building className="h-6 w-6 text-skill-purple" />
          Gerenciamento de Equipes
        </h2>
        
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>Nova Equipe</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Equipe</DialogTitle>
            </DialogHeader>
            <AddTeamForm onClose={() => setOpenDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      {teams.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Membros</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => {
              const teamMembers = collaborators.filter(c => c.teamId === team.id);
              return (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">{team.name}</TableCell>
                  <TableCell>{teamMembers.length}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveTeam(team.id, team.name)}
                    >
                      Remover
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-10 border rounded-md">
          <p className="text-muted-foreground">Nenhuma equipe cadastrada.</p>
          <p className="text-muted-foreground">Adicione equipes para organizar seus colaboradores.</p>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
