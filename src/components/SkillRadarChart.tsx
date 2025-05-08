
import { Collaborator, Skill } from '@/types';
import { useMatrix } from '@/context/MatrixContext';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

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

  // Transform skills to radar chart data format
  const chartData = skills.map(skill => ({
    subject: getSkillName(skill.id),
    value: getSkillRating(skill.id),
    fullMark: 5,
  })).filter(item => item.value > 0); // Only include skills with ratings

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Sem dados suficientes para exibir o gráfico</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <h3 className="text-lg font-medium mb-2 text-center">Análise de Habilidades</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <Radar
            name="Habilidades"
            dataKey="value"
            stroke="#9b87f5"
            fill="#9b87f5"
            fillOpacity={0.6}
          />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillRadarChart;
