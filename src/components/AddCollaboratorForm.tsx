
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMatrix } from '@/context/MatrixContext';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AddCollaboratorForm: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { teams, addCollaborator } = useMatrix();
  const [name, setName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [photo, setPhoto] = useState('');
  const [previewPhoto, setPreviewPhoto] = useState('');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewPhoto(result);
        setPhoto(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Por favor, insira um nome para o colaborador.");
      return;
    }
    
    if (!teamId) {
      toast.error("Por favor, selecione uma equipe.");
      return;
    }
    
    addCollaborator({
      name,
      photo: photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=9b87f5&color=fff`,
      skills: [],
      isFocal: false,
      teamId
    });
    
    toast.success(`${name} foi adicionado com sucesso.`);
    
    // Reset form
    setName('');
    setTeamId('');
    setPhoto('');
    setPreviewPhoto('');
    
    if (onClose) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nome do Colaborador</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome completo"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="team">Equipe</Label>
          <Select value={teamId} onValueChange={setTeamId}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecione uma equipe" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="photo">Foto</Label>
          <Input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="mt-1"
          />
          
          {previewPhoto && (
            <div className="mt-4 flex justify-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={previewPhoto} />
                <AvatarFallback>
                  {name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        )}
        <Button type="submit">Adicionar Colaborador</Button>
      </div>
    </form>
  );
};

export default AddCollaboratorForm;
