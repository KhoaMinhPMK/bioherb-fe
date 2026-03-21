import React, { useState, useMemo } from 'react';
import { Plus, Shield, Edit2, Trash2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import FilterBar from '../../components/FilterBar';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import './AdminUsers.scss';
const users = [
    { id: 1, name: 'Nguyễn Thị Bình', email: 'binh@sankit.vn', role: 'Chủ farm', farms: 'Tất cả', status: 'active', lastLogin: '21/03/2026 10:30' },
    { id: 2, name: 'Trần Văn Tài', email: 'tai@sankit.vn', role: 'Kỹ thuật', farms: 'Farm Long An, Farm Đồng Tháp', status: 'active', lastLogin: '21/03/2026 08:15' },
    { id: 3, name: 'Nguyễn An', email: 'an@sankit.vn', role: 'Nhân viên', farms: 'Farm Long An', status: 'active', lastLogin: '20/03/2026 16:45' },
    { id: 4, name: 'Lê Thị Cúc', email: 'cuc@sankit.vn', role: 'Quản lý', farms: 'Farm Long An, Farm Tiền Giang', status: 'active', lastLogin: '21/03/2026 09:00' },
    { id: 5, name: 'Nguyễn Văn Phương', email: 'phuong@sankit.vn', role: 'Nhân viên', farms: 'Farm Đồng Tháp', status: 'inactive', lastLogin: '15/03/2026 14:20' },
    { id: 6, name: 'Phạm Minh Tuấn', email: 'tuan@sankit.vn', role: 'Kỹ thuật', farms: 'Farm Tiền Giang', status: 'active', lastLogin: '19/03/2026 11:00' },
];
const roles = [
    { name: 'Chủ farm', count: 1, color: '#8b5cf6' },
    { name: 'Quản lý', count: 1, color: '#3b82f6' },
    { name: 'Kỹ thuật', count: 2, color: '#16a34a' },
    { name: 'Nhân viên', count: 2, color: '#f59e0b' },
];
const columns = [
    { key: 'name', label: 'Họ tên', sortable: true, render: (v) => <span style={{ fontWeight: 500 }}>{v}</span> },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Vai trò', render: (v) => <StatusBadge status={v} variant="info" label={v}/> },
    {
        key: 'farms', label: 'Farm',
        render: (v) => <span className="admin-farms-cell">{v}</span>
    },
    {
        key: 'status', label: 'Trạng thái',
        render: (v) => <StatusBadge status={v === 'active' ? 'Active' : 'Closed'} label={v === 'active' ? 'Hoạt động' : 'Ngừng'}/>
    },
    { key: 'lastLogin', label: 'Đăng nhập cuối' },
    {
        key: 'id', label: 'Thao tác',
        render: (_, row) => (<div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-icon" aria-label={`Sửa ${row.name}`}><Edit2 size={16}/></button>
                <button className="btn-icon btn-icon--danger" aria-label={`Xóa ${row.name}`}><Trash2 size={16}/></button>
            </div>)
    },
];
const AdminUsers = () => {
    const [search, setSearch] = useState('');
    const filtered = useMemo(() => {
        if (!search)
            return users;
        const s = search.toLowerCase();
        return users.filter(u => u.name.toLowerCase().includes(s) ||
            u.email.toLowerCase().includes(s) ||
            u.role.toLowerCase().includes(s));
    }, [search]);
    return (<div className="page-container">
            <PageHeader title="Quản trị người dùng" subtitle="Quản lý tài khoản và phân quyền" actions={<button className="btn btn--primary"><Plus size={16}/> Thêm người dùng</button>}/>

            {/* Role Summary */}
            <div className="admin-role-grid">
                {roles.map(r => (<div key={r.name} className="card">
                        <div className="card__body admin-role-card">
                            <div className="admin-role-card__icon" style={{ background: `${r.color}15`, color: r.color }}>
                                <Shield size={20}/>
                            </div>
                            <div>
                                <span className="admin-role-card__label">{r.name}</span>
                                <p className="admin-role-card__count">{r.count}</p>
                            </div>
                        </div>
                    </div>))}
            </div>

            <FilterBar onSearch={setSearch} searchPlaceholder="Tìm người dùng..."/>

            <DataTable columns={columns} data={filtered} pageSize={5}/>
        </div>);
};
export default AdminUsers;
