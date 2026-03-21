import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, User, Menu, Settings, LogOut, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import './Header.scss';
const breadcrumbMap = {
    '/': 'Dashboard',
    '/farms': 'Farm',
    '/plots': 'Vùng trồng',
    '/crop-cycles': 'Mùa vụ',
    '/task-plans': 'Kế hoạch',
    '/task-logs': 'Nhật ký',
    '/input-items': 'Vật tư',
    '/resources': 'Nhân công & Thiết bị',
    '/pest-incidents': 'Sâu bệnh',
    '/harvests': 'Thu hoạch',
    '/qr': 'QR Truy xuất',
    '/reports': 'Báo cáo',
    '/admin/users': 'Quản trị',
};
const Header = ({ onMenuToggle }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { addToast } = useToast();
    
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const profileRef = useRef(null);
    const notifRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setIsNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const getCurrentPage = () => {
        const path = location.pathname;
        for (const [key, value] of Object.entries(breadcrumbMap)) {
            if (path === key || (key !== '/' && path.startsWith(key))) {
                return value;
            }
        }
        return 'Dashboard';
    };
    return (<header className="app-header" role="banner">
            <div className="app-header__left">
                <button className="app-header__menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
                    <Menu size={20} aria-hidden="true"/>
                </button>
                <nav className="app-header__breadcrumb" aria-label="Breadcrumb">
                    <span className="app-header__breadcrumb-page">{getCurrentPage()}</span>
                </nav>
            </div>

            <div className="app-header__right">
                <div className="app-header__search">
                    <Search size={16} className="app-header__search-icon" aria-hidden="true"/>
                    <label htmlFor="header-search" className="sr-only">Tìm kiếm</label>
                    <input id="header-search" type="text" placeholder="Tìm kiếm..." className="app-header__search-input"/>
                </div>

                <div className="app-header__icon-wrapper" ref={notifRef}>
                    <button 
                        className={`app-header__icon-btn ${isNotifOpen ? 'app-header__icon-btn--active' : ''}`} 
                        onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
                        aria-label="Thông báo"
                    >
                        <Bell size={20} aria-hidden="true"/>
                        <span className="app-header__notification-dot"/>
                    </button>

                    {isNotifOpen && (
                        <div className="app-header__dropdown app-header__dropdown--notif">
                            <div className="app-header__dropdown-header">
                                <h3>Thông báo</h3>
                                <button className="app-header__dropdown-mark" onClick={() => {
                            addToast('Đã đánh dấu tất cả là đã đọc', 'success');
                            setIsNotifOpen(false);
                        }}>Đánh dấu đã đọc</button>
                            </div>
                            <div className="app-header__notif-list">
                                <div className="app-header__notif-item app-header__notif-item--unread">
                                    <div className="app-header__notif-icon app-header__notif-icon--error">
                                        <AlertCircle size={16} />
                                    </div>
                                    <div className="app-header__notif-content">
                                        <p><strong>Farm Long An</strong> phát hiện tỷ lệ rầy nâu vượt mức.</p>
                                        <span>10 phút trước</span>
                                    </div>
                                </div>
                                <div className="app-header__notif-item app-header__notif-item--unread">
                                    <div className="app-header__notif-icon app-header__notif-icon--success">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <div className="app-header__notif-content">
                                        <p><strong>Trần Văn Tài</strong> đã nộp bảng chấm công tuần.</p>
                                        <span>2 giờ trước</span>
                                    </div>
                                </div>
                                <div className="app-header__notif-item">
                                    <div className="app-header__notif-icon app-header__notif-icon--info">
                                        <Info size={16} />
                                    </div>
                                    <div className="app-header__notif-content">
                                        <p>Mùa vụ <strong>2026-DX</strong> được duyệt trạng thái In-progress.</p>
                                        <span>Hôm qua</span>
                                    </div>
                                </div>
                            </div>
                            <div className="app-header__dropdown-footer">
                                <button onClick={() => {
                            addToast('Đang tải danh sách thông báo đầy đủ...', 'info');
                            setIsNotifOpen(false);
                        }}>Xem tất cả thông báo</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="app-header__user-wrapper" ref={profileRef}>
                    <div 
                        className={`app-header__user ${isProfileOpen ? 'app-header__user--active' : ''}`} 
                        onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
                    >
                        <div className="app-header__avatar" aria-hidden="true">
                            <User size={18}/>
                        </div>
                        <div className="app-header__user-info">
                            <span className="app-header__user-name">Nguyễn Thị Bình</span>
                            <span className="app-header__user-role">Quản lý</span>
                        </div>
                    </div>

                    {isProfileOpen && (
                        <div className="app-header__dropdown app-header__dropdown--profile">
                            <div className="app-header__profile-header">
                                <div className="app-header__avatar">
                                    <User size={18}/>
                                </div>
                                <div className="app-header__profile-info">
                                    <span className="app-header__profile-name">Nguyễn Thị Bình</span>
                                    <span className="app-header__profile-email">binh@sankit.vn</span>
                                </div>
                            </div>
                            <div className="app-header__dropdown-divider" />
                            <button className="app-header__dropdown-item" onClick={() => {
                            addToast('Trang Hồ sơ cá nhân đang phát triển...', 'info');
                            setIsProfileOpen(false);
                        }}>
                                <User size={16}/> Hồ sơ cá nhân
                            </button>
                            <button className="app-header__dropdown-item" onClick={() => {
                            addToast('Trang Cài đặt đang phát triển...', 'info');
                            setIsProfileOpen(false);
                        }}>
                                <Settings size={16}/> Cài đặt hệ thống
                            </button>
                            <div className="app-header__dropdown-divider"/>
                            <button className="app-header__dropdown-item app-header__dropdown-item--danger" onClick={() => navigate('/login')}>
                                <LogOut size={16}/> Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>);
};
export default Header;
