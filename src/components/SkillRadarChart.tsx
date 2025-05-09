
import { Collaborator, Skill } from '@/types';
import { useMatrix } from '@/context/MatrixContext';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar, 
  ResponsiveContainer, 
  Tooltip,
  PolarRadiusAxis,
  Legend
} from 'recharts';

interface SkillRadarChartProps {
  collaborator: Collaborator;
}

const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ collaborator }) => {
  const { skills } = useMatrix();

  const getSkillRating = (skillId: string) => {
    const skillRating = collaborator.skills.find(s => s.skillId === skillId);
    return skillRating?.rating === 'N/A' ? 0 : skillRating?.rating || 0;
  };

  const getSkillName = (skillId: string) => {
    return skills.find(s => s.id === skillId)?.name || '';
  };

  const getSkillCategory = (skillId: string) => {
    return skills.find(s => s.id === skillId)?.category || 'hard';
  };

  // Get only skill IDs assigned to collaborator that have numerical ratings
  const assignedSkillIds = collaborator.skills
    .filter(skill => skill.rating !== 'N/A' && typeof skill.rating === 'number')
    .map(skill => skill.skillId);

  // Transform assigned skills for chart data
  const chartData = assignedSkillIds.map(skillId => ({
    subject: getSkillName(skillId),
    value: getSkillRating(skillId),
    category: getSkillCategory(skillId),
    fullMark: 5,
  })).filter(item => item.value > 0); // Only include skills with ratings

  // Color mapping
  const categoryColors = {
    hard: "#9b87f5",
    soft: "#7E69AB",
    knowledge: "#4CAF50"
  };

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Sem dados suficientes para exibir o gráfico</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      <h3 className="text-lg font-medium mb-4 text-center">Análise de Habilidades</h3>
      
      <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 flex-1">
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 11 }} />
            <PolarRadiusAxis domain={[0, 5]} tick={{ fill: '#6b7280' }} />
            
            <Radar
              name="Nível de Habilidade"
              dataKey="value"
              stroke="#9b87f5"
              fill="#9b87f5"
              fillOpacity={0.6}
            />
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
              }}
              formatter={(value, name, entry) => {
                const item = entry.payload;
                const category = item.category;
                const categoryLabel = category === 'hard' ? 'Hard Skill' : 
                                      category === 'soft' ? 'Soft Skill' : 'Conhecimento';
                return [`Nível: ${value}`, `${name} (${categoryLabel})`];
              }}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SkillRadarChart;
