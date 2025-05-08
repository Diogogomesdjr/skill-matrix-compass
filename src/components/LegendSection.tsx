
import { Card, CardContent } from '@/components/ui/card';

const LegendSection: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h3 className="font-semibold text-lg mb-4">Legenda da Matriz de Habilidades</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium mb-2">Níveis de Habilidade:</h4>
            <ul className="space-y-1">
              <li className="flex items-center gap-2">
                <span className="block w-4 h-4 rounded-full bg-skill-na"></span>
                <span>N/A - Não Aplicável</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="block w-4 h-4 rounded-full bg-skill-level1"></span>
                <span>1 - Iniciante - Precisa de supervisão constante</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="block w-4 h-4 rounded-full bg-skill-level2"></span>
                <span>2 - Básico - Consegue executar com alguma ajuda</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="block w-4 h-4 rounded-full bg-skill-level3"></span>
                <span>3 - Intermediário - Executa de forma independente</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="block w-4 h-4 rounded-full bg-skill-level4"></span>
                <span>4 - Avançado - Pode ensinar outros</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="block w-4 h-4 rounded-full bg-skill-level5"></span>
                <span>5 - Especialista - Referência na habilidade</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Símbolos:</h4>
            <ul className="space-y-1">
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-skill-purple"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" x2="4" y1="22" y2="15"></line></svg>
                <span>Colaborador Responsável</span>
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-skill-level5"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
                <span>Apto para executar a tarefa</span>
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><circle cx="12" cy="12" r="10"></circle><path d="M22 2 2 22"></path></svg>
                <span>Não apto para executar a tarefa</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Como utilizar:</h4>
            <ul className="space-y-1 text-sm">
              <li>• Clique nas bolinhas de avaliação para mudar o nível da habilidade</li>
              <li>• Clique no ícone ao lado da bolinha para alterar entre apto/não apto</li>
              <li>• Utilize os filtros para visualizar por equipe ou colaborador</li>
              <li>• Adicione novas habilidades e equipes conforme necessário</li>
              <li>• Defina colaboradores responsáveis utilizando o botão dedicado</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LegendSection;
