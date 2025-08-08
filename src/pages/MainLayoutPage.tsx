import React from 'react';
import { Outlet } from 'react-router-dom';
import NavRail from '../components/layout/NavRail';

const MainLayoutPage: React.FC = () => {
  return (
    <div className="flex h-screen bg-white dark:bg-[#36393f] font-sans">
      <NavRail />
      <main className="flex-1 flex flex-col min-w-0">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayoutPage;
