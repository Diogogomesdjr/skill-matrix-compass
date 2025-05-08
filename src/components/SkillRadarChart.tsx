
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

  // Transform skills to radar chart data format
  const chartData = skills.map(skill => ({
    subject: getSkillName(skill.id),
    value: getSkillRating(skill.id),
    category: getSkillCategory(skill.id),
    fullMark: 5,
  })).filter(item => item.value > 0); // Only include skills with ratings

  const hardSkillsData = chartData.filter(item => item.category === 'hard');
  const softSkillsData = chartData.filter(item => item.category === 'soft');

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
      
      {hardSkillsData.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium mb-3 text-center">Hard Skills</h4>
          <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={hardSkillsData}>
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
                  formatter={(value) => [`Nível: ${value}`, 'Habilidade']}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      {softSkillsData.length > 0 && (
        <div>
          <h4 className="text-md font-medium mb-3 text-center">Soft Skills</h4>
          <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={softSkillsData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 5]} tick={{ fill: '#6b7280' }} />
                <Radar
                  name="Nível de Habilidade"
                  dataKey="value"
                  stroke="#7E69AB"
                  fill="#7E69AB"
                  fillOpacity={0.6}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                  }}
                  formatter={(value) => [`Nível: ${value}`, 'Habilidade']}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillRadarChart;
