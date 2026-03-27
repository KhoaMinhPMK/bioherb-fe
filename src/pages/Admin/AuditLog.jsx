import React, { useState, useMemo } from 'react';
import { User, Clock } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import FilterBar from '../../components/FilterBar';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import './AuditLog.scss';

const mockLogs = [
    {
        id: 1,
        timestamp: '2026-03-23 08:30',
        user: 'Nguyễn Văn An',
        action: 'Tạo mùa vụ',
        target: '2026-DX',
        module: 'crop_cycles',
        type: 'create',
    },
    {
        id: 2,
        timestamp: '2026-03-23 08:15',
        user: 'Admin',
        action: 'Cập nhật vai trò',
        target: 'Trần Văn Tài → approver',
        module: 'users',
        type: 'update',
    },
    {
        id: 3,
        timestamp: '2026-03-23 07:50',
        user: 'Lê Thị Hoa',
        action: 'Duyệt nhật ký',
        target: 'TL015',
        module: 'task_logs',
        type: 'approve',
    },
    {
        id: 4,
        timestamp: '2026-03-22 17:30',
        user: 'Nguyễn Văn An',
        action: 'Xóa vật tư',
        target: 'Thuốc hết hạn',
        module: 'input_items',
        type: 'delete',
    },
    {
        id: 5,
        timestamp: '2026-03-22 16:00',
        user: 'Admin',
        action: 'Thêm người dùng',
        target: 'Phạm Minh Tuấn',
        module: 'users',
        type: 'create',
    },
    {
        id: 6,
        timestamp: '2026-03-22 14:20',
        user: 'Trần Văn Tài',
        action: 'Ghi nhật ký',
        target: 'Bón phân Cúc Hoa Vàng',
        module: 'task_logs',
        type: 'create',
    },
    {
        id: 7,
        timestamp: '2026-03-22 10:05',
        user: 'Admin',
        action: 'Đăng nhập hệ thống',
        target: '',
        module: 'auth',
        type: 'login',
    },
    {
        id: 8,
        timestamp: '2026-03-21 16:45',
        user: 'Lê Thị Hoa',
        action: 'Từ chối nhật ký',
        target: 'TL012',
        module: 'task_logs',
        type: 'reject',
    },
    {
        id: 9,
        timestamp: '2026-03-21 14:00',
        user: 'Nguyễn Văn An',
        action: 'Cập nhật farm',
        target: 'Farm Long An',
        module: 'farms',
        type: 'update',
    },
    {
        id: 10,
        timestamp: '2026-03-21 09:30',
        user: 'Admin',
        action: 'Export báo cáo',
        target: 'Báo cáo Q1-2026',
        module: 'reports',
        type: 'export',
    },
    {
        id: 11,
        timestamp: '2026-03-20 15:20',
        user: 'Trần Văn Tài',
        action: 'Ghi thu hoạch',
        target: 'Lô H05 - 4500kg',
        module: 'harvests',
        type: 'create',
    },
    {
        id: 12,
        timestamp: '2026-03-20 11:00',
        user: 'Admin',
        action: 'Reset mật khẩu',
        target: 'Trần Văn Tài',
        module: 'users',
        type: 'update',
    },
];

const typeColors = {
    create: 'Active',
    update: 'Harvesting',
    delete: 'Closed',
    approve: 'Active',
    reject: 'Closed',
    login: 'Active',
    export: 'Harvesting',
};
const typeLabels = {
    create: 'Tạo',
    update: 'Sửa',
    delete: 'Xóa',
    approve: 'Duyệt',
    reject: 'Từ chối',
    login: 'Đăng nhập',
    export: 'Xuất',
};

const filterConfigs = [
    { key: 'type', label: 'Loại', options: Object.entries(typeLabels).map(([k, v]) => ({ value: k, label: v })) },
];

const AuditLog = () => {
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({});

    const filtered = useMemo(() => {
        let list = mockLogs;
        if (search) {
            const s = search.toLowerCase();
            list = list.filter(
                (l) =>
                    l.user.toLowerCase().includes(s) ||
                    l.action.toLowerCase().includes(s) ||
                    l.target.toLowerCase().includes(s),
            );
        }
        if (filters.type) list = list.filter((l) => l.type === filters.type);
        return list;
    }, [search, filters]);

    const columns = [
        {
            key: 'timestamp',
            label: 'Thời gian',
            width: '150px',
            render: (v) => (
                <span className="audit__time">
                    <Clock size={12} /> {v}
                </span>
            ),
        },
        {
            key: 'user',
            label: 'Người dùng',
            render: (v) => (
                <span className="audit__user">
                    <User size={12} /> {v}
                </span>
            ),
        },
        { key: 'action', label: 'Hành động' },
        { key: 'target', label: 'Đối tượng', hideOnMobile: true },
        { key: 'type', label: 'Loại', render: (v) => <StatusBadge status={typeColors[v]} label={typeLabels[v]} /> },
    ];

    return (
        <div className="page-container">
            <PageHeader title="Nhật ký hệ thống" subtitle="Theo dõi mọi thao tác trong hệ thống" />
            <FilterBar
                searchPlaceholder="Tìm hoạt động..."
                onSearch={setSearch}
                filters={filterConfigs}
                onFilterChange={setFilters}
            />
            <div className="card">
                <DataTable columns={columns} data={filtered} pageSize={10} />
            </div>
        </div>
    );
};

export default AuditLog;
