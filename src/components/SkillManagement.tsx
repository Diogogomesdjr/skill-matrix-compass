
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useMatrix } from '@/context/MatrixContext';
import { toast } from 'sonner';
import AddSkillForm from './AddSkillForm';
import { ChartRadar } from 'lucide-react';

const SkillManagement: React.FC = () => {
  const { skills, removeSkill, collaborators } = useMatrix();
  const [openDialog, setOpenDialog] = useState(false);

  const handleRemoveSkill = (id: string, name: string) => {
    const skillIsInUse = collaborators.some(c => 
      c.skills.some(s => s.skillId === id)
    );
    
    if (skillIsInUse) {
      toast.error(`Não é possível remover a habilidade "${name}" pois está sendo usada por um ou mais colaboradores.`);
      return;
    }
    
    removeSkill(id);
    toast.success(`Habilidade "${name}" foi removida com sucesso.`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ChartRadar className="h-6 w-6 text-skill-purple" />
          Gerenciamento de Habilidades
        </h2>
        
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>Nova Habilidade</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Habilidade</DialogTitle>
            </DialogHeader>
            <AddSkillForm onClose={() => setOpenDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      {skills.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skills.map((skill) => (
              <TableRow key={skill.id}>
                <TableCell className="font-medium">{skill.name}</TableCell>
                <TableCell>
                  <Badge variant={skill.category === 'hard' ? 'default' : 'secondary'}>
                    {skill.category === 'hard' ? 'Hard Skill' : 'Soft Skill'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveSkill(skill.id, skill.name)}
                  >
                    Remover
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-10 border rounded-md">
          <p className="text-muted-foreground">Nenhuma habilidade cadastrada.</p>
          <p className="text-muted-foreground">Adicione habilidades para avaliar seus colaboradores.</p>
        </div>
      )}
    </div>
  );
};

export default SkillManagement;
