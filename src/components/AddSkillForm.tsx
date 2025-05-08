
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useMatrix } from '@/context/MatrixContext';
import { toast } from 'sonner';

const AddSkillForm: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { addSkill } = useMatrix();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'hard' | 'soft'>('hard');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Por favor, insira um nome para a habilidade.");
      return;
    }
    
    addSkill({ name, category });
    toast.success(`Habilidade ${name} foi adicionada com sucesso.`);
    
    // Reset form
    setName('');
    setCategory('hard');
    
    if (onClose) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="skillName">Nome da Habilidade</Label>
          <Input
            id="skillName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome da habilidade"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="category">Categoria</Label>
          <RadioGroup
            value={category}
            onValueChange={(value) => setCategory(value as 'hard' | 'soft')}
            className="flex space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hard" id="hard" />
              <Label htmlFor="hard">Hard Skill</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="soft" id="soft" />
              <Label htmlFor="soft">Soft Skill</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        )}
        <Button type="submit">Adicionar Habilidade</Button>
      </div>
    </form>
  );
};

export default AddSkillForm;
