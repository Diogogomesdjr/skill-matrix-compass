
import { MatrixProvider } from '@/context/MatrixContext';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  return (
    <MatrixProvider>
      <Dashboard />
    </MatrixProvider>
  );
};

export default Index;
