import React from 'react';
import { Outlet } from 'react-router-dom';
import { SettingsSidebar } from './SettingsSidebar';

export const SettingsLayout: React.FC = () => {
    return (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-full bg-gray-50/50 dark:bg-background-dark">
            <SettingsSidebar />
            <Outlet />
        </div>
    );
};
