
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMatrix } from '@/context/MatrixContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Award } from 'lucide-react';

const RecognitionSection = () => {
  const { collaborators, teams, skills } = useMatrix();
  const [selectedTeam, setSelectedTeam] = useState<string | 'all'>('all');

  const filteredCollaborators = selectedTeam === 'all'
    ? collaborators
    : collaborators.filter(collaborator => collaborator.teamId === selectedTeam);

  const calculateCollaboratorStats = (collaborator: typeof collaborators[0]) => {
    const totalSkills = collaborator.skills.length;
    const aptSkills = collaborator.skills.filter(skill => skill.isApt).length;
    const aptPercentage = totalSkills > 0 ? Math.round((aptSkills / totalSkills) * 100) : 0;
    
    // Categorize skills by level 4 and 5 (advanced and expert)
    const advancedSkills = collaborator.skills.filter(skill => 
      typeof skill.rating === 'number' && skill.rating >= 4
    ).length;
    
    const independentPercentage = totalSkills > 0 ? Math.round((advancedSkills / totalSkills) * 100) : 0;
    
    const isEligibleForRecognition = aptPercentage >= 75;
    const needsAttention = aptPercentage < 50;
    
    return {
      totalSkills,
      aptSkills,
      aptPercentage,
      advancedSkills,
      independentPercentage,
      isEligibleForRecognition,
      needsAttention
    };
  };

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : 'Sem equipe';
  };
  
  const getStatusBadge = (stats: ReturnType<typeof calculateCollaboratorStats>) => {
    if (stats.needsAttention) {
      return <Badge variant="destructive">Precisa de Atenção</Badge>;
    } else if (stats.isEligibleForRecognition) {
      return <Badge variant="default" className="bg-green-600">Apto para Reconhecimento</Badge>;
    } else {
      return <Badge variant="secondary">Em Desenvolvimento</Badge>;
    }
  };

  const collaboratorsNeedingAttention = filteredCollaborators.filter(collab => 
    calculateCollaboratorStats(collab).needsAttention
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Award className="h-6 w-6 text-skill-purple" aria-label="Recognition icon" />
          Reconhecimento de Colaboradores
        </h2>
        
        <div className="w-64">
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
      </div>

      {collaboratorsNeedingAttention.length > 0 && (
        <Alert variant="destructive">
          <Award className="h-4 w-4" />
          <AlertTitle>Atenção necessária!</AlertTitle>
          <AlertDescription>
            {collaboratorsNeedingAttention.length} colaborador(es) está(ão) com menos de 50% de aptidão 
            e precisa(m) de atenção especial para desenvolvimento.
          </AlertDescription>
        </Alert>
      )}
      
      {filteredCollaborators.length > 0 ? (
        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Equipe</TableHead>
                <TableHead>Aptidão</TableHead>
                <TableHead>Execução Independente</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCollaborators.map((collaborator) => {
                const stats = calculateCollaboratorStats(collaborator);
                
                return (
                  <TableRow key={collaborator.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {collaborator.name}
                        {collaborator.isFocal && (
                          <Badge variant="outline" className="ml-2">Ponto Focal</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getTeamName(collaborator.teamId)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              stats.aptPercentage >= 75 ? 'bg-green-500' : 
                              stats.aptPercentage >= 50 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`}
                            style={{ width: `${stats.aptPercentage}%` }}
                          />
                        </div>
                        <span className="ml-2 text-sm">{stats.aptPercentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500"
                            style={{ width: `${stats.independentPercentage}%` }}
                          />
                        </div>
                        <span className="ml-2 text-sm">{stats.independentPercentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(stats)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="text-center py-10 border rounded-md">
          <p className="text-muted-foreground">Nenhum colaborador encontrado.</p>
          <p className="text-muted-foreground">Adicione colaboradores e avalie suas habilidades para ver o status de reconhecimento.</p>
        </div>
      )}
    </div>
  );
};

export default RecognitionSection;
