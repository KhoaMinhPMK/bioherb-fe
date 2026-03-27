import React, { useState, useCallback } from 'react';
import { Globe, Bell, Palette, Save } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { useToast } from '../../contexts/ToastContext';
import './Settings.scss';

const Settings = () => {
    const { addToast } = useToast();
    const [settings, setSettings] = useState({
        language: 'vi',
        theme: 'light',
        notifications: true,
        emailNotifications: true,
        soundEnabled: true,
        autoRefresh: true,
        refreshInterval: 30,
    });

    const handleChange = useCallback((key, value) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleSave = useCallback(() => {
        localStorage.setItem('bioherb_settings', JSON.stringify(settings));
        addToast('Đã lưu cài đặt', 'success');
    }, [settings, addToast]);

    return (
        <div className="page-container">
            <PageHeader
                title="Cài đặt hệ thống"
                subtitle="Tùy chỉnh giao diện và thông báo"
                actions={
                    <button className="btn btn--primary" onClick={handleSave}>
                        <Save size={16} /> Lưu cài đặt
                    </button>
                }
            />

            <div className="settings-grid">
                {/* Language */}
                <div className="card settings-section">
                    <div className="settings-section__header">
                        <Globe size={20} />
                        <h3>Ngôn ngữ</h3>
                    </div>
                    <div className="settings-section__body">
                        <div className="form-field">
                            <label className="form-field__label">Ngôn ngữ hiển thị</label>
                            <select
                                className="form-field__input"
                                value={settings.language}
                                onChange={(e) => handleChange('language', e.target.value)}
                            >
                                <option value="vi">Tiếng Việt</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Theme */}
                <div className="card settings-section">
                    <div className="settings-section__header">
                        <Palette size={20} />
                        <h3>Giao diện</h3>
                    </div>
                    <div className="settings-section__body">
                        <div className="form-field">
                            <label className="form-field__label">Chế độ hiển thị</label>
                            <select
                                className="form-field__input"
                                value={settings.theme}
                                onChange={(e) => handleChange('theme', e.target.value)}
                            >
                                <option value="light">Sáng</option>
                                <option value="dark">Tối</option>
                                <option value="auto">Tự động</option>
                            </select>
                        </div>
                        <div className="settings-section__toggle">
                            <label className="settings-toggle">
                                <input
                                    type="checkbox"
                                    checked={settings.autoRefresh}
                                    onChange={(e) => handleChange('autoRefresh', e.target.checked)}
                                />
                                <span className="settings-toggle__slider" />
                                <span className="settings-toggle__label">Tự động làm mới dữ liệu</span>
                            </label>
                        </div>
                        {settings.autoRefresh && (
                            <div className="form-field">
                                <label className="form-field__label">Tần suất làm mới (giây)</label>
                                <input
                                    className="form-field__input"
                                    type="number"
                                    value={settings.refreshInterval}
                                    onChange={(e) =>
                                        handleChange('refreshInterval', parseInt(e.target.value, 10) || 30)
                                    }
                                    min="10"
                                    max="300"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Notifications */}
                <div className="card settings-section">
                    <div className="settings-section__header">
                        <Bell size={20} />
                        <h3>Thông báo</h3>
                    </div>
                    <div className="settings-section__body">
                        <div className="settings-section__toggle">
                            <label className="settings-toggle">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications}
                                    onChange={(e) => handleChange('notifications', e.target.checked)}
                                />
                                <span className="settings-toggle__slider" />
                                <span className="settings-toggle__label">Bật thông báo</span>
                            </label>
                        </div>
                        <div className="settings-section__toggle">
                            <label className="settings-toggle">
                                <input
                                    type="checkbox"
                                    checked={settings.emailNotifications}
                                    onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                                />
                                <span className="settings-toggle__slider" />
                                <span className="settings-toggle__label">Thông báo qua email</span>
                            </label>
                        </div>
                        <div className="settings-section__toggle">
                            <label className="settings-toggle">
                                <input
                                    type="checkbox"
                                    checked={settings.soundEnabled}
                                    onChange={(e) => handleChange('soundEnabled', e.target.checked)}
                                />
                                <span className="settings-toggle__slider" />
                                <span className="settings-toggle__label">Âm thanh thông báo</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
