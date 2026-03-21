import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, MapPin, Sprout, CalendarDays, BookOpen,
    Package, Users, Bug, Wheat, QrCode, BarChart3, Shield,
    ChevronLeft, ChevronRight, Building2, X,
} from 'lucide-react';
import logo from '../../assets/images/logo.svg';
import './Sidebar.scss';

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
            { path: '/farms', icon: Building2, label: 'Farm' },
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
        items: [
            { path: '/reports', icon: BarChart3, label: 'Báo cáo' },
            { path: '/admin/users', icon: Shield, label: 'Quản trị' },
        ],
    },
];

const Sidebar = ({ collapsed, mobileOpen, onToggle, onMobileClose }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/' || location.pathname === '/dashboard';
        return location.pathname.startsWith(path);
    };

    const handleNavigation = (path) => {
        navigate(path);
        // Auto-close sidebar on mobile after navigation
        if (onMobileClose) {
            onMobileClose();
        }
    };

    // Build class names
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
                {/* Mobile close button */}
                <button
                    className="sidebar__close-btn"
                    onClick={onMobileClose}
                    aria-label="Đóng menu"
                >
                    <X size={20} aria-hidden="true" />
                </button>
            </div>

            <nav className="sidebar__nav" aria-label="Main navigation">
                {menuItems.map((group, gi) => (
                    <div key={gi} className="sidebar__group" role="group" aria-label={group.group}>
                        {!collapsed && (
                            <div className="sidebar__group-label">{group.group}</div>
                        )}
                        {group.items.map((item) => {
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
                ))}
            </nav>

            {/* Desktop collapse toggle (hidden on mobile via CSS) */}
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
