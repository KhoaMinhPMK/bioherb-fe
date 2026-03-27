import React, { useState, useCallback, useRef, useMemo } from 'react';
import { User, Mail, Phone, Shield, Save, Camera, Lock, Calendar, Clock, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import './Profile.scss';

const Profile = () => {
    const navigate = useNavigate();
    const { currentUser, currentFarm, currentHtx, roleLabel } = useAuth();
    const { updateUser, isLoading } = useData();
    const { addToast } = useToast();
    const [editMode, setEditMode] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        phone: currentUser?.phone || '',
        email: currentUser?.email || '',
    });

    const handleAvatarChange = useCallback(
        (e) => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    setAvatarPreview(ev.target.result);
                    addToast('Đã chọn ảnh đại diện mới', 'success');
                };
                reader.readAsDataURL(file);
            }
        },
        [addToast],
    );

    const handleSave = useCallback(async () => {
        if (!formData.name.trim()) {
            addToast('Vui lòng nhập họ tên', 'error');
            return;
        }
        await updateUser(currentUser.id, formData);
        addToast('Đã cập nhật thông tin', 'success');
        setEditMode(false);
    }, [formData, currentUser, updateUser, addToast]);

    const activityLogs = useMemo(
        () => [
            { id: 1, action: 'Đăng nhập hệ thống', time: '08:30 hôm nay', icon: Clock },
            { id: 2, action: 'Cập nhật hồ sơ cá nhân', time: '16:20 hôm qua', icon: User },
            { id: 3, action: 'Duyệt nhật ký TL015', time: '14:05 hôm qua', icon: Activity },
            { id: 4, action: 'Tạo kế hoạch gieo sạ VT01', time: '10:30 20/03', icon: Calendar },
            { id: 5, action: 'Đăng nhập hệ thống', time: '08:15 20/03', icon: Clock },
        ],
        [],
    );

    if (!currentUser) return null;

    return (
        <div className="page-container">
            <PageHeader title="Hồ sơ cá nhân" subtitle="Xem và cập nhật thông tin cá nhân" />

            <div className="profile-page">
                {/* Avatar Card */}
                <div className="card profile-card">
                    <div className="profile-card__avatar">
                        <div className="profile-card__avatar-circle">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar" className="profile-card__avatar-img" />
                            ) : (
                                <User size={40} />
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} accept="image/*" onChange={handleAvatarChange} hidden />
                        <button
                            className="profile-card__avatar-edit"
                            title="Đổi ảnh đại diện"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Camera size={14} />
                        </button>
                    </div>
                    <h2 className="profile-card__name">{currentUser.name}</h2>
                    <span className="profile-card__role">{roleLabel}</span>
                    <div className="profile-card__badges">
                        {currentFarm && <span className="profile-card__badge">🏡 {currentFarm.name}</span>}
                        {currentHtx && <span className="profile-card__badge">🤝 {currentHtx.name}</span>}
                    </div>
                </div>

                {/* Info Card */}
                <div className="card profile-info">
                    <div className="profile-info__header">
                        <h3>Thông tin chi tiết</h3>
                        {!editMode && (
                            <button className="btn btn--outline" onClick={() => setEditMode(true)}>
                                <Save size={14} /> Chỉnh sửa
                            </button>
                        )}
                    </div>

                    {editMode ? (
                        <div className="form-fields">
                            <div className="form-field">
                                <label className="form-field__label">
                                    <User size={14} /> Họ tên
                                </label>
                                <input
                                    className="form-field__input"
                                    value={formData.name}
                                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                                />
                            </div>
                            <div className="form-field">
                                <label className="form-field__label">
                                    <Mail size={14} /> Email
                                </label>
                                <input
                                    className="form-field__input"
                                    value={formData.email}
                                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                                />
                            </div>
                            <div className="form-field">
                                <label className="form-field__label">
                                    <Phone size={14} /> Số điện thoại
                                </label>
                                <input
                                    className="form-field__input"
                                    value={formData.phone}
                                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                                />
                            </div>
                            <div className="profile-info__actions">
                                <button className="btn btn--outline" onClick={() => setEditMode(false)}>
                                    Hủy
                                </button>
                                <button className="btn btn--primary" onClick={handleSave} disabled={isLoading}>
                                    <Save size={14} /> Lưu
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="profile-info__grid">
                            <div className="profile-info__item">
                                <User size={16} />
                                <div>
                                    <span className="profile-info__label">Họ tên</span>
                                    <span className="profile-info__value">{currentUser.name}</span>
                                </div>
                            </div>
                            <div className="profile-info__item">
                                <Mail size={16} />
                                <div>
                                    <span className="profile-info__label">Email</span>
                                    <span className="profile-info__value">{currentUser.email}</span>
                                </div>
                            </div>
                            <div className="profile-info__item">
                                <Phone size={16} />
                                <div>
                                    <span className="profile-info__label">SĐT</span>
                                    <span className="profile-info__value">{currentUser.phone || '—'}</span>
                                </div>
                            </div>
                            <div className="profile-info__item">
                                <Shield size={16} />
                                <div>
                                    <span className="profile-info__label">Vai trò</span>
                                    <span className="profile-info__value">{roleLabel}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Row: Security + Activity */}
                <div className="profile-bottom-row">
                    <div className="card">
                        <div className="profile-info__header">
                            <h3>
                                <Lock size={16} /> Bảo mật
                            </h3>
                        </div>
                        <p className="profile-info__label">Thay đổi mật khẩu đăng nhập của bạn</p>
                        <button className="btn btn--outline" onClick={() => navigate('/change-password')}>
                            <Lock size={14} /> Đổi mật khẩu
                        </button>
                    </div>

                    <div className="card">
                        <div className="profile-info__header">
                            <h3>
                                <Activity size={16} /> Hoạt động gần đây
                            </h3>
                        </div>
                        <div className="profile-activity__list">
                            {activityLogs.map((log) => {
                                const Icon = log.icon;
                                return (
                                    <div key={log.id} className="profile-activity__item">
                                        <Icon size={14} className="profile-activity__icon" />
                                        <span className="profile-activity__text">{log.action}</span>
                                        <span className="profile-activity__time">{log.time}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
