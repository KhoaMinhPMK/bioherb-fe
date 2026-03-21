import React, { useState, useCallback } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import './MainLayout.scss';
const MainLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const toggleSidebar = useCallback(() => {
        setCollapsed((prev) => !prev);
    }, []);
    return (<div className={`app-layout ${collapsed ? 'app-layout--collapsed' : ''}`}>
            <Sidebar collapsed={collapsed} onToggle={toggleSidebar}/>
            <div className="app-layout__main">
                <Header onMenuToggle={toggleSidebar}/>
                <main className="app-layout__content" role="main">
                    {children}
                </main>
            </div>
        </div>);
};
export default MainLayout;
