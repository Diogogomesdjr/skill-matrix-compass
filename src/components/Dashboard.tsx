
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMatrix } from '@/context/MatrixContext';
import CollaboratorCard from './CollaboratorCard';
import AddCollaboratorForm from './AddCollaboratorForm';
import TeamManagement from './TeamManagement';
import SkillManagement from './SkillManagement';
import LegendSection from './LegendSection';
import { UserPlus } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { collaborators, teams } = useMatrix();
  const [selectedTeam, setSelectedTeam] = useState<string | 'all'>('all');
  const [openDialog, setOpenDialog] = useState(false);
  
  const filteredCollaborators = selectedTeam === 'all'
    ? collaborators
    : collaborators.filter(collaborator => collaborator.teamId === selectedTeam);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2 text-skill-dark">Matriz de Habilidades</h1>
      <p className="text-muted-foreground mb-6">Gerencie e acompanhe o desenvolvimento das habilidades da sua equipe.</p>
      
      <LegendSection />
      
      <Tabs defaultValue="collaborators" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="collaborators">Colaboradores</TabsTrigger>
          <TabsTrigger value="teams">Equipes</TabsTrigger>
          <TabsTrigger value="skills">Habilidades</TabsTrigger>
        </TabsList>
        
        <TabsContent value="collaborators" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="w-full md:w-64">
              <Select value={selectedTeam} onValueChange={(value) => setSelectedTeam(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por equipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as equipes</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus size={18} />
                  Adicionar Colaborador
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Colaborador</DialogTitle>
                </DialogHeader>
                <AddCollaboratorForm onClose={() => setOpenDialog(false)} />
              </DialogContent>
            </Dialog>
          </div>
          
          {filteredCollaborators.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {filteredCollaborators.map((collaborator) => (
                <CollaboratorCard key={collaborator.id} collaborator={collaborator} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border rounded-md">
              <p className="text-muted-foreground">Nenhum colaborador encontrado.</p>
              {selectedTeam !== 'all' ? (
                <p className="text-muted-foreground">Tente selecionar outra equipe ou adicione colaboradores.</p>
              ) : (
                <p className="text-muted-foreground">Adicione colaboradores para começar a utilizar a matriz de habilidades.</p>
              )}
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setOpenDialog(true)}
              >
                Adicionar Colaborador
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="teams">
          <TeamManagement />
        </TabsContent>
        
        <TabsContent value="skills">
          <SkillManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
