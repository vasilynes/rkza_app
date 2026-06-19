import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { InstallBanner } from './InstallBanner';

export function Layout() {
  return (
    <div style={{ paddingBottom: '80px' }}>
      <Outlet />
      <BottomNav />
      <InstallBanner />
    </div>
  );
}