import React, { useState, useCallback } from 'react';
import { Shield, Save } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { useToast } from '../../contexts/ToastContext';
import './PermissionMatrix.scss';

const MODULES = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'farms', label: 'Farm' },
    { key: 'plots', label: 'Vùng trồng' },
    { key: 'crop_cycles', label: 'Mùa vụ' },
    { key: 'task_plans', label: 'Kế hoạch' },
    { key: 'task_logs', label: 'Nhật ký' },
    { key: 'input_items', label: 'Vật tư' },
    { key: 'resources', label: 'Nhân công & TB' },
    { key: 'pest', label: 'Sâu bệnh' },
    { key: 'harvests', label: 'Thu hoạch' },
    { key: 'reports', label: 'Báo cáo' },
    { key: 'admin', label: 'Quản trị' },
];

const ROLES = [
    { key: 'admin', label: 'Admin' },
    { key: 'htx_manager', label: 'QL HTX' },
    { key: 'farm_manager', label: 'Chủ Farm' },
    { key: 'approver', label: 'Duyệt viên' },
    { key: 'worker', label: 'Nhân viên' },
];

const ACTIONS = ['view', 'create', 'edit', 'delete', 'approve'];

const defaultPerms = () => {
    const matrix = {};
    ROLES.forEach((r) => {
        matrix[r.key] = {};
        MODULES.forEach((m) => {
            matrix[r.key][m.key] = {};
            ACTIONS.forEach((a) => {
                if (r.key === 'admin') {
                    matrix[r.key][m.key][a] = true;
                } else if (r.key === 'htx_manager') {
                    matrix[r.key][m.key][a] = a !== 'delete' || m.key !== 'admin';
                } else if (r.key === 'farm_manager') {
                    matrix[r.key][m.key][a] = m.key !== 'admin' && (a === 'view' || a === 'create' || a === 'edit');
                } else if (r.key === 'approver') {
                    matrix[r.key][m.key][a] = a === 'view' || a === 'approve';
                } else {
                    matrix[r.key][m.key][a] = a === 'view';
                }
            });
        });
    });
    return matrix;
};

const PermissionMatrix = () => {
    const { addToast } = useToast();
    const [perms, setPerms] = useState(defaultPerms);
    const [selectedRole, setSelectedRole] = useState('admin');

    const togglePerm = useCallback(
        (module, action) => {
            setPerms((prev) => {
                const next = { ...prev };
                next[selectedRole] = { ...next[selectedRole] };
                next[selectedRole][module] = { ...next[selectedRole][module] };
                next[selectedRole][module][action] = !next[selectedRole][module][action];
                return next;
            });
        },
        [selectedRole],
    );

    const handleSave = useCallback(() => {
        addToast('Đã lưu phân quyền', 'success');
    }, [addToast]);

    const actionLabels = { view: 'Xem', create: 'Tạo', edit: 'Sửa', delete: 'Xóa', approve: 'Duyệt' };

    return (
        <div className="page-container">
            <PageHeader
                title="Phân quyền"
                subtitle="Ma trận quyền theo vai trò và module"
                actions={
                    <button className="btn btn--primary" onClick={handleSave}>
                        <Save size={16} /> Lưu thay đổi
                    </button>
                }
            />

            <div className="perm__role-tabs">
                {ROLES.map((r) => (
                    <button
                        key={r.key}
                        className={`perm__role-tab ${selectedRole === r.key ? 'perm__role-tab--active' : ''}`}
                        onClick={() => setSelectedRole(r.key)}
                    >
                        <Shield size={14} /> {r.label}
                    </button>
                ))}
            </div>

            <div className="card">
                <div className="card__body perm__table-wrapper">
                    <table className="perm__table">
                        <thead>
                            <tr>
                                <th>Module</th>
                                {ACTIONS.map((a) => (
                                    <th key={a} className="perm__check-cell">
                                        {actionLabels[a]}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {MODULES.map((m) => (
                                <tr key={m.key}>
                                    <td className="perm__module-name">{m.label}</td>
                                    {ACTIONS.map((a) => (
                                        <td key={a} className="perm__check-cell">
                                            <label className="perm__checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={perms[selectedRole]?.[m.key]?.[a] || false}
                                                    onChange={() => togglePerm(m.key, a)}
                                                />
                                                <span className="perm__checkbox-mark" />
                                            </label>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PermissionMatrix;
