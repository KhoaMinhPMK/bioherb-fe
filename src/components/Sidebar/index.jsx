import React from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    MapPin,
    Sprout,
    CalendarDays,
    BookOpen,
    Package,
    Bug,
    Wheat,
    QrCode,
    BarChart3,
    Shield,
    ChevronLeft,
    ChevronRight,
    Building2,
    X,
    Calendar,
    Warehouse,
    Boxes,
    Lock,
    HelpCircle,
    Activity,
    Handshake,
    ToggleLeft,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useFeatureFlags } from '../../contexts/FeatureFlagContext';
import logoImg from '../../assets/images/logo_img.svg';
import logoChar from '../../assets/images/logo_char.svg';
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
            { path: '/calendar', icon: Calendar, label: 'Lịch canh tác' },
        ],
    },
    {
        group: 'Quản lý Farm',
        items: [
            { path: '/cooperatives', icon: Handshake, label: 'Hợp tác xã', roles: ['admin', 'htx_manager'] },
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
            { path: '/warehouse', icon: Warehouse, label: 'Kho vật tư' },
        ],
    },
    {
        group: 'Sản xuất',
        items: [
            { path: '/pest-incidents', icon: Bug, label: 'Sâu bệnh' },
            { path: '/harvests', icon: Wheat, label: 'Thu hoạch' },
            { path: '/lots', icon: Boxes, label: 'Lô hàng', roles: ['admin', 'htx_manager', 'farm_manager'] },
            { path: '/qr', icon: QrCode, label: 'QR Truy xuất' },
        ],
    },
    {
        group: 'Hệ thống',
        roles: ['admin', 'htx_manager', 'farm_manager'],
        items: [
            { path: '/reports', icon: BarChart3, label: 'Báo cáo' },
            { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard Admin', roles: ['admin'] },
            { path: '/admin/users', icon: Shield, label: 'Quản trị user', roles: ['admin'] },
            { path: '/admin/permissions', icon: Lock, label: 'Phân quyền', roles: ['admin'] },
            { path: '/admin/audit-log', icon: Activity, label: 'Nhật ký HT', roles: ['admin'] },
            { path: '/admin/features', icon: ToggleLeft, label: 'Quản lý tính năng', roles: ['admin'] },
        ],
    },
    {
        group: 'Hỗ trợ',
        items: [{ path: '/help', icon: HelpCircle, label: 'Hướng dẫn' }],
    },
];

const Sidebar = ({ collapsed, mobileOpen, onToggle, onMobileClose }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { role } = useAuth();
    const { isSidebarPathEnabled } = useFeatureFlags();

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

    /** Check if a group or item is visible for the current role and feature flags */
    const isVisible = (entry) => {
        if (!entry.roles) return true;
        return entry.roles.includes(role);
    };

    /** Check role visibility AND feature flag for a menu item */
    const isItemVisible = (item) => {
        if (!isVisible(item)) return false;
        return isSidebarPathEnabled(item.path, role);
    };

    const sidebarClasses = ['sidebar', collapsed ? 'sidebar--collapsed' : '', mobileOpen ? 'sidebar--open' : '']
        .filter(Boolean)
        .join(' ');

    return (
        <aside className={sidebarClasses} role="navigation" aria-label="Sidebar navigation">
            <div className="sidebar__logo">
                <img src={logoImg} alt="BioHerb logo" className="sidebar__logo-img" />
                {!collapsed && (
                    <div className="sidebar__logo-text">
                        <img src={logoChar} alt="BioHerb" className="sidebar__logo-char" />
                        <span className="sidebar__logo-version">v1.0</span>
                    </div>
                )}
                <button className="sidebar__close-btn" onClick={onMobileClose} aria-label="Đóng menu">
                    <X size={20} aria-hidden="true" />
                </button>
            </div>

            <nav className="sidebar__nav" aria-label="Main navigation">
                {menuItems.map((group) => {
                    // Skip entire group if role doesn't match
                    if (!isVisible(group)) return null;

                    // Filter items within the group by role and feature flags
                    const visibleItems = group.items.filter(isItemVisible);
                    if (visibleItems.length === 0) return null;

                    return (
                        <div key={group.group} className="sidebar__group" role="group" aria-label={group.group}>
                            {!collapsed && <div className="sidebar__group-label">{group.group}</div>}
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
                                        {!collapsed && <span className="sidebar__item-label">{item.label}</span>}
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
                {collapsed ? (
                    <ChevronRight size={18} aria-hidden="true" />
                ) : (
                    <ChevronLeft size={18} aria-hidden="true" />
                )}
            </button>
        </aside>
    );
};

Sidebar.propTypes = {
    collapsed: PropTypes.bool.isRequired,
    mobileOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    onMobileClose: PropTypes.func.isRequired,
};

export default Sidebar;
