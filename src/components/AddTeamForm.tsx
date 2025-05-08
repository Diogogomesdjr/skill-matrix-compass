
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMatrix } from '@/context/MatrixContext';
import { toast } from 'sonner';

const AddTeamForm: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { addTeam } = useMatrix();
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Por favor, insira um nome para a equipe.");
      return;
    }
    
    addTeam({ name });
    toast.success(`Equipe ${name} foi adicionada com sucesso.`);
    
    // Reset form
    setName('');
    
    if (onClose) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="teamName">Nome da Equipe</Label>
        <Input
          id="teamName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome da equipe"
          className="mt-1"
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        )}
        <Button type="submit">Adicionar Equipe</Button>
      </div>
    </form>
  );
};

export default AddTeamForm;
