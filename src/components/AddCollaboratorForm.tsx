
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMatrix } from '@/context/MatrixContext';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Skill, SkillRating } from '@/types';

const AddCollaboratorForm: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { teams, skills, addCollaborator } = useMatrix();
  const [name, setName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [photo, setPhoto] = useState('');
  const [previewPhoto, setPreviewPhoto] = useState('');
  const [step, setStep] = useState<'info' | 'skills'>('info');
  const [selectedSkills, setSelectedSkills] = useState<Record<string, boolean>>({});
  
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

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Por favor, insira um nome para o colaborador.");
      return;
    }
    
    if (!teamId) {
      toast.error("Por favor, selecione uma equipe.");
      return;
    }
    
    // Move to skills selection
    setStep('skills');
  };
  
  const handleSkillToggle = (skillId: string) => {
    setSelectedSkills(prev => ({
      ...prev,
      [skillId]: !prev[skillId]
    }));
  };
  
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedSkillIds = Object.entries(selectedSkills)
      .filter(([_, isSelected]) => isSelected)
      .map(([skillId]) => skillId);
    
    const collaboratorSkills: SkillRating[] = selectedSkillIds.map(skillId => ({
      skillId,
      rating: 'N/A',
      isApt: false
    }));
    
    addCollaborator({
      name,
      photo: photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=9b87f5&color=fff`,
      skills: collaboratorSkills,
      isFocal: false,
      teamId
    });
    
    toast.success(`${name} foi adicionado com sucesso.`);
    
    // Reset form
    setName('');
    setTeamId('');
    setPhoto('');
    setPreviewPhoto('');
    setSelectedSkills({});
    setStep('info');
    
    if (onClose) {
      onClose();
    }
  };

  if (step === 'info') {
    return (
      <form onSubmit={handleInfoSubmit} className="space-y-6">
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
          <Button type="submit">Próximo</Button>
        </div>
      </form>
    );
  }
  
  // Skills selection step
  return (
    <form onSubmit={handleFinalSubmit} className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Selecione as habilidades para {name}</h3>
        
        {skills.length > 0 ? (
          <div className="space-y-6">
            <div className="space-y-3 max-h-[300px] overflow-y-auto p-2">
              <h4 className="font-medium">Conhecimentos</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {skills
                  .filter(skill => skill.category === 'knowledge')
                  .map(skill => (
                    <div key={skill.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`skill-${skill.id}`}
                        checked={!!selectedSkills[skill.id]}
                        onCheckedChange={() => handleSkillToggle(skill.id)}
                      />
                      <Label htmlFor={`skill-${skill.id}`} className="text-sm">
                        {skill.name}
                      </Label>
                    </div>
                  ))}
              </div>
            </div>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto p-2">
              <h4 className="font-medium">Habilidades</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {skills
                  .filter(skill => skill.category !== 'knowledge')
                  .map(skill => (
                    <div key={skill.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`skill-${skill.id}`}
                        checked={!!selectedSkills[skill.id]}
                        onCheckedChange={() => handleSkillToggle(skill.id)}
                      />
                      <Label htmlFor={`skill-${skill.id}`} className="text-sm">
                        {skill.name}
                      </Label>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            Nenhuma habilidade cadastrada. Adicione habilidades primeiro.
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => setStep('info')}>
          Voltar
        </Button>
        <Button type="submit">Adicionar Colaborador</Button>
      </div>
    </form>
  );
};

export default AddCollaboratorForm;
