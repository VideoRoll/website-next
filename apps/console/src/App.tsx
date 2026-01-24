import { Outlet } from 'react-router-dom';
import { TopNav } from './components/layout/TopNav';
import { useNProgress } from './hooks/useNProgress';

export function App() {
  useNProgress();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/10">
      <TopNav />
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
