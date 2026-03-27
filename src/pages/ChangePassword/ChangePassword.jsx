import React, { useState, useCallback } from 'react';
import { Lock, Eye, EyeOff, Save } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import './ChangePassword.scss';

const ChangePassword = () => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [formData, setFormData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

    const handleSave = useCallback(() => {
        if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
            addToast('Vui lòng nhập đủ thông tin', 'error');
            return;
        }
        if (formData.newPassword.length < 6) {
            addToast('Mật khẩu mới phải ít nhất 6 ký tự', 'error');
            return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            addToast('Xác nhận mật khẩu không khớp', 'error');
            return;
        }
        addToast('Đã đổi mật khẩu thành công', 'success');
        setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    }, [formData, addToast]);

    return (
        <div className="page-container">
            <PageHeader title="Đổi mật khẩu" subtitle={`Tài khoản: ${currentUser?.email || ''}`} />

            <div className="change-pwd__container">
                <div className="card change-pwd__card">
                    <div className="change-pwd__icon">
                        <Lock size={40} />
                    </div>

                    <div className="form-fields">
                        <div className="form-field">
                            <label className="form-field__label">Mật khẩu hiện tại</label>
                            <div className="change-pwd__input-wrap">
                                <input
                                    className="form-field__input"
                                    type={showOld ? 'text' : 'password'}
                                    value={formData.oldPassword}
                                    onChange={(e) => setFormData((p) => ({ ...p, oldPassword: e.target.value }))}
                                    placeholder="Nhập mật khẩu hiện tại"
                                />
                                <button className="change-pwd__eye" onClick={() => setShowOld(!showOld)} type="button">
                                    {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div className="form-field">
                            <label className="form-field__label">Mật khẩu mới</label>
                            <div className="change-pwd__input-wrap">
                                <input
                                    className="form-field__input"
                                    type={showNew ? 'text' : 'password'}
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData((p) => ({ ...p, newPassword: e.target.value }))}
                                    placeholder="Ít nhất 6 ký tự"
                                />
                                <button className="change-pwd__eye" onClick={() => setShowNew(!showNew)} type="button">
                                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div className="form-field">
                            <label className="form-field__label">Xác nhận mật khẩu mới</label>
                            <div className="change-pwd__input-wrap">
                                <input
                                    className="form-field__input"
                                    type={showConfirm ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData((p) => ({ ...p, confirmPassword: e.target.value }))}
                                    placeholder="Nhập lại mật khẩu mới"
                                />
                                <button
                                    className="change-pwd__eye"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    type="button"
                                >
                                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button className="btn btn--primary change-pwd__save" onClick={handleSave}>
                        <Save size={16} /> Đổi mật khẩu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
