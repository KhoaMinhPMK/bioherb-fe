import React from 'react';
import { Plus, Users, Wrench } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
const workers = [
    { id: 'NC01', name: 'Nguyễn An', role: 'Nhân viên', salary: '300.000', phone: '0901234567', status: 'active' },
    { id: 'NC02', name: 'Trần Văn Tài', role: 'Kỹ thuật', salary: '350.000', phone: '0912345678', status: 'active' },
    { id: 'NC03', name: 'Nguyễn Văn Phương', role: 'Nhân viên', salary: '300.000', phone: '0923456789', status: 'active' },
    { id: 'NC04', name: 'Lê Thị Cúc', role: 'Quản lý', salary: '500.000', phone: '0934567890', status: 'active' },
];
const equipment = [
    { id: 'TB01', name: 'Máy cày', type: 'Máy nông nghiệp', fuelCost: '150.000', status: 'active' },
    { id: 'TB02', name: 'Máy gặt lúa', type: 'Máy nông nghiệp', fuelCost: '200.000', status: 'active' },
    { id: 'TB03', name: 'Máy bơm nước', type: 'Thiết bị tưới', fuelCost: '50.000', status: 'pending' },
];
const workerColumns = [
    { key: 'id', label: 'Mã', width: '80px', render: (v) => <strong>{v}</strong> },
    { key: 'name', label: 'Họ tên', sortable: true, render: (v) => <span className="font-medium">{v}</span> },
    { key: 'role', label: 'Chức vụ', sortable: true },
    { key: 'salary', label: 'Lương/ngày', render: (v) => `${v} ₫` },
    { key: 'phone', label: 'SĐT' },
    { key: 'status', label: 'Trạng thái', render: (v) => <StatusBadge status={v}/> },
];
const equipmentColumns = [
    { key: 'id', label: 'Mã', width: '80px', render: (v) => <strong>{v}</strong> },
    { key: 'name', label: 'Tên thiết bị', sortable: true, render: (v) => <span className="font-medium">{v}</span> },
    { key: 'type', label: 'Loại', sortable: true },
    { key: 'fuelCost', label: 'Chi phí NL/giờ', render: (v) => `${v} ₫` },
    { key: 'status', label: 'Trạng thái', render: (v) => <StatusBadge status={v}/> },
];
const ResourceList = () => (<div className="page-container">
        <PageHeader title="Nhân công & Thiết bị" subtitle="Quản lý nguồn lực sản xuất" actions={<button className="btn btn--primary" onClick={() => window.addToast('Tính năng thêm mới nguồn lực đang phát triển', 'info')}><Plus size={16}/> Thêm mới</button>}/>

        <h3 className="section-heading"><Users size={18} aria-hidden="true"/> Nhân công</h3>
        <div className="card">
            <DataTable columns={workerColumns} data={workers} pageSize={10}/>
        </div>

        <h3 className="section-heading section-heading--spaced"><Wrench size={18} aria-hidden="true"/> Thiết bị</h3>
        <div className="card">
            <DataTable columns={equipmentColumns} data={equipment} pageSize={10}/>
        </div>
    </div>);
export default ResourceList;
