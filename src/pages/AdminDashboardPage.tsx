import React from 'react';
import DashboardLayout from '../components/admin/DashboardLayout';

const AdminDashboardPage: React.FC = () => {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">Admin Dashboard</h1>

      {/* Example stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500">Total Users</p>
          <p className="text-2xl font-semibold mt-2">1,248</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500">Active Today</p>
          <p className="text-2xl font-semibold mt-2">213</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500">Reports</p>
          <p className="text-2xl font-semibold mt-2">5</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;
