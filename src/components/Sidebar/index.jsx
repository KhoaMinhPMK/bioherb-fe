import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, MapPin, Sprout, CalendarDays, BookOpen,
    Package, Users, Bug, Wheat, QrCode, BarChart3, Shield,
    ChevronLeft, ChevronRight, Building2, X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/images/logo.svg';
import './Sidebar.scss';

/**
 * Menu items with role-based visibility.
 * `roles`: array of roles that can see this item. If omitted, all roles can see it.
 */
const menuItems = [
    {
        group: 'Tổng quan',
        items: [
            { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        ],
    },
    {
        group: 'Quản lý Farm',
        items: [
            { path: '/farms', icon: Building2, label: 'Farm', roles: ['admin', 'htx_manager', 'farm_manager'] },
            { path: '/plots', icon: MapPin, label: 'Vùng trồng' },
            { path: '/crop-cycles', icon: Sprout, label: 'Mùa vụ' },
        ],
    },
    {
        group: 'Hoạt động',
        items: [
            { path: '/task-plans', icon: CalendarDays, label: 'Kế hoạch' },
            { path: '/task-logs', icon: BookOpen, label: 'Nhật ký' },
        ],
    },
    {
        group: 'Danh mục',
        roles: ['admin', 'htx_manager', 'farm_manager', 'approver'],
        items: [
            { path: '/input-items', icon: Package, label: 'Vật tư' },
            { path: '/resources', icon: Users, label: 'Nhân công & Thiết bị' },
        ],
    },
    {
        group: 'Sản xuất',
        items: [
            { path: '/pest-incidents', icon: Bug, label: 'Sâu bệnh' },
            { path: '/harvests', icon: Wheat, label: 'Thu hoạch' },
            { path: '/qr', icon: QrCode, label: 'QR Truy xuất' },
        ],
    },
    {
        group: 'Hệ thống',
        roles: ['admin', 'htx_manager', 'farm_manager'],
        items: [
            { path: '/reports', icon: BarChart3, label: 'Báo cáo' },
            { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard Admin', roles: ['admin'] },
            { path: '/admin/users', icon: Shield, label: 'Quản trị', roles: ['admin'] },
        ],
    },
];

const Sidebar = ({ collapsed, mobileOpen, onToggle, onMobileClose }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { role } = useAuth();

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/' || location.pathname === '/dashboard';
        return location.pathname.startsWith(path);
    };

    const handleNavigation = (path) => {
        navigate(path);
        if (onMobileClose) {
            onMobileClose();
        }
    };

    /** Check if a group or item is visible for the current role */
    const isVisible = (entry) => {
        if (!entry.roles) return true;
        return entry.roles.includes(role);
    };

    const sidebarClasses = [
        'sidebar',
        collapsed ? 'sidebar--collapsed' : '',
        mobileOpen ? 'sidebar--open' : '',
    ].filter(Boolean).join(' ');

    return (
        <aside className={sidebarClasses} role="navigation" aria-label="Sidebar navigation">
            <div className="sidebar__logo">
                <img src={logo} alt="SANKIT logo" className="sidebar__logo-img" />
                {!collapsed && (
                    <div className="sidebar__logo-text">
                        <span className="sidebar__logo-name">SANKIT</span>
                        <span className="sidebar__logo-version">v1.0</span>
                    </div>
                )}
                <button
                    className="sidebar__close-btn"
                    onClick={onMobileClose}
                    aria-label="Đóng menu"
                >
                    <X size={20} aria-hidden="true" />
                </button>
            </div>

            <nav className="sidebar__nav" aria-label="Main navigation">
                {menuItems.map((group, gi) => {
                    // Skip entire group if role doesn't match
                    if (!isVisible(group)) return null;

                    // Filter items within the group by role
                    const visibleItems = group.items.filter(isVisible);
                    if (visibleItems.length === 0) return null;

                    return (
                        <div key={gi} className="sidebar__group" role="group" aria-label={group.group}>
                            {!collapsed && (
                                <div className="sidebar__group-label">{group.group}</div>
                            )}
                            {visibleItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.path);
                                return (
                                    <button
                                        key={item.path}
                                        className={`sidebar__item ${active ? 'sidebar__item--active' : ''}`}
                                        onClick={() => handleNavigation(item.path)}
                                        title={collapsed ? item.label : undefined}
                                        aria-label={item.label}
                                        aria-current={active ? 'page' : undefined}
                                    >
                                        <Icon size={20} className="sidebar__item-icon" aria-hidden="true" />
                                        {!collapsed && (
                                            <span className="sidebar__item-label">{item.label}</span>
                                        )}
                                        {active && <div className="sidebar__item-indicator" />}
                                    </button>
                                );
                            })}
                        </div>
                    );
                })}
            </nav>

            <button
                className="sidebar__toggle"
                onClick={onToggle}
                aria-label={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
            >
                {collapsed
                    ? <ChevronRight size={18} aria-hidden="true" />
                    : <ChevronLeft size={18} aria-hidden="true" />
                }
            </button>
        </aside>
    );
};

export default Sidebar;
