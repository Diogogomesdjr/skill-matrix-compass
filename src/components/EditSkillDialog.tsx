
import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useMatrix } from '@/context/MatrixContext';
import { useState } from 'react';

interface EditSkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skill: { id: string; name: string; category: string } | null;
}

const EditSkillDialog: React.FC<EditSkillDialogProps> = ({ open, onOpenChange, skill }) => {
  const { updateSkill } = useMatrix();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'hard' | 'soft' | 'knowledge'>('hard');

  useEffect(() => {
    if (skill) {
      setName(skill.name);
      setCategory(skill.category as 'hard' | 'soft' | 'knowledge');
    }
  }, [skill]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!skill) return;

    if (!name.trim()) {
      toast.error("O nome da habilidade é obrigatório.");
      return;
    }

    updateSkill(skill.id, { name, category });
    toast.success(`Habilidade "${name}" atualizada com sucesso.`);
    onOpenChange(false);
  };

  if (!skill) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Habilidade</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Habilidade</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Liderança, Excel, Análise de Dados"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={(value: 'hard' | 'soft' | 'knowledge') => setCategory(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hard">Hard Skill</SelectItem>
                <SelectItem value="soft">Soft Skill</SelectItem>
                <SelectItem value="knowledge">Conhecimento</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSkillDialog;
