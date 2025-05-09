
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useMatrix } from '@/context/MatrixContext';
import { toast } from 'sonner';
import AddSkillForm from './AddSkillForm';
import { BarChart, Edit } from 'lucide-react';
import EditSkillDialog from './EditSkillDialog';

const SkillManagement: React.FC = () => {
  const { skills, removeSkill, collaborators } = useMatrix();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSkill, setEditingSkill] = useState<{id: string, name: string, category: string} | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'knowledge': return { label: 'Conhecimento', variant: 'outline' as const };
      case 'hard': return { label: 'Hard Skill', variant: 'default' as const };
      case 'soft': return { label: 'Soft Skill', variant: 'secondary' as const };
      default: return { label: category, variant: 'outline' as const };
    }
  };

  const handleEditSkill = (skill: {id: string, name: string, category: string}) => {
    setEditingSkill(skill);
    setIsEditDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BarChart className="h-6 w-6 text-skill-purple" />
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
              <TableHead className="w-[160px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skills.map((skill) => {
              const categoryInfo = getCategoryLabel(skill.category);
              return (
                <TableRow key={skill.id}>
                  <TableCell className="font-medium">{skill.name}</TableCell>
                  <TableCell>
                    <Badge variant={categoryInfo.variant}>
                      {categoryInfo.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditSkill({id: skill.id, name: skill.name, category: skill.category})}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveSkill(skill.id, skill.name)}
                      >
                        Remover
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-10 border rounded-md">
          <p className="text-muted-foreground">Nenhuma habilidade cadastrada.</p>
          <p className="text-muted-foreground">Adicione habilidades para avaliar seus colaboradores.</p>
        </div>
      )}

      <EditSkillDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
        skill={editingSkill} 
      />
    </div>
  );
};

export default SkillManagement;
