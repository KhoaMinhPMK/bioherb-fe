import React from 'react';
import { Plus, Bug } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import FilterBar from '../../components/FilterBar';
import StatusBadge from '../../components/StatusBadge';
const incidents = [
    { id: 1, date: '18/03/2026', cycle: '2026-DX', plot: 'Ruộng lúa ST25', type: 'Đạo ôn', severity: 'Trung bình', area: '0.3 ha', treatment: 'Phun Sieubymsa 75WP', status: 'resolved' },
    { id: 2, date: '10/03/2026', cycle: '2026-XH', plot: 'Ruộng cà chua', type: 'Bọ phấn trắng', severity: 'Nhẹ', area: '0.1 ha', treatment: 'Phun thuốc trừ sâu', status: 'resolved' },
    { id: 3, date: '05/03/2026', cycle: '2026-DX-2', plot: 'Ruộng lúa nếp', type: 'Chuột', severity: 'Nặng', area: '1 ha', treatment: 'Đặt bẫy + thuốc chuột', status: 'monitoring' },
];
const severityMap = { 'Nặng': 'error', 'Trung bình': 'warning', 'Nhẹ': 'info' };
const columns = [
    { key: 'date', label: 'Ngày', sortable: true, width: '100px' },
    { key: 'plot', label: 'Vùng trồng', sortable: true, render: (v) => <span className="font-medium">{v}</span> },
    { key: 'cycle', label: 'Mùa vụ', render: (v) => <code className="cycle-code">{v}</code> },
    { key: 'type', label: 'Loại', render: (v) => <span><Bug size={14} aria-hidden="true" className="icon-inline"/> {v}</span> },
    { key: 'severity', label: 'Mức độ', render: (v) => <StatusBadge status={v} variant={severityMap[v]} label={v}/> },
    { key: 'area', label: 'Diện tích' },
    { key: 'treatment', label: 'Biện pháp' },
    { key: 'status', label: 'Trạng thái', render: (v) => <StatusBadge status={v}/> },
];
const PestIncidentList = () => (<div className="page-container">
        <PageHeader title="Sâu bệnh / Sự cố" subtitle="Theo dõi và xử lý sâu bệnh, sự cố trên đồng" actions={<button className="btn btn--primary" onClick={() => window.addToast('Tính năng ghi nhận sự cố đang phát triển', 'info')}><Plus size={16}/> Ghi nhận sự cố</button>}/>
        <FilterBar searchPlaceholder="Tìm sự cố..." onSearch={() => { }}/>
        <div className="card">
            <DataTable columns={columns} data={incidents} pageSize={10}/>
        </div>
    </div>);
export default PestIncidentList;
