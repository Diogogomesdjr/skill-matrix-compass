
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMatrix } from '@/context/MatrixContext';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const AddSkillForm: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { addSkill } = useMatrix();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'knowledge' | 'hard' | 'soft'>('knowledge');
  const [step, setStep] = useState<'name' | 'category'>('name');

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Por favor, insira um nome para a habilidade.");
      return;
    }
    
    setStep('category');
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addSkill({ name, category });
    toast.success(`Habilidade ${name} foi adicionada com sucesso.`);
    
    // Reset form
    setName('');
    setCategory('knowledge');
    setStep('name');
    
    if (onClose) {
      onClose();
    }
  };

  if (step === 'name') {
    return (
      <form onSubmit={handleNameSubmit} className="space-y-6">
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
        </div>
        
        <div className="flex justify-end space-x-2">
          {onClose && (
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          )}
          <Button type="submit">Próximo</Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleCategorySubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="category">Qual o tipo da habilidade "{name}"?</Label>
          <RadioGroup
            value={category}
            onValueChange={(value) => setCategory(value as 'knowledge' | 'hard' | 'soft')}
            className="flex flex-col space-y-3 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="knowledge" id="knowledge" />
              <Label htmlFor="knowledge">Conhecimento</Label>
            </div>
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
        <Button type="button" variant="outline" onClick={() => setStep('name')}>
          Voltar
        </Button>
        <Button type="submit">Adicionar Habilidade</Button>
      </div>
    </form>
  );
};

export default AddSkillForm;
