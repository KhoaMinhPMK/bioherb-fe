import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import useIsMobile from '../../hooks/useIsMobile';
import './MainLayout.scss';

const MainLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const isMobile = useIsMobile(768);
    const location = useLocation();

    // Desktop: toggle collapsed/expanded
    // Mobile: toggle off-canvas slide-in
    const handleMenuToggle = useCallback(() => {
        if (isMobile) {
            setMobileOpen((prev) => !prev);
        } else {
            setCollapsed((prev) => !prev);
        }
    }, [isMobile]);

    // Close mobile sidebar
    const handleMobileClose = useCallback(() => {
        setMobileOpen(false);
    }, []);

    // Auto-close mobile sidebar on route change
    useEffect(() => {
        if (isMobile) {
            setMobileOpen(false);
        }
    }, [location.pathname, isMobile]);

    // Close mobile sidebar when resizing to desktop
    useEffect(() => {
        if (!isMobile) {
            setMobileOpen(false);
        }
    }, [isMobile]);

    // Lock body scroll when mobile sidebar is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileOpen]);

    // Listen for sidebar collapse request (e.g. from GACP workspace)
    useEffect(() => {
        const handleCollapseRequest = (e) => {
            if (!isMobile) {
                setCollapsed(!!e.detail);
            }
        };
        window.addEventListener('sidebar:request-collapse', handleCollapseRequest);
        return () => window.removeEventListener('sidebar:request-collapse', handleCollapseRequest);
    }, [isMobile]);

    return (
        <div className={`app-layout ${collapsed ? 'app-layout--collapsed' : ''}`}>
            <Sidebar
                collapsed={collapsed}
                mobileOpen={mobileOpen}
                onToggle={handleMenuToggle}
                onMobileClose={handleMobileClose}
            />

            {/* Mobile overlay backdrop */}
            {mobileOpen && (
                <div
                    className="app-layout__overlay app-layout__overlay--visible"
                    onClick={handleMobileClose}
                    aria-hidden="true"
                />
            )}

            <div className="app-layout__main">
                <Header onMenuToggle={handleMenuToggle} />
                <main className="app-layout__content" role="main">
                    {children}
                </main>
            </div>
        </div>
    );
};

MainLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default MainLayout;
