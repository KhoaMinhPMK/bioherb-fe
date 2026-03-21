import React from 'react';
import { Plus, Wheat, QrCode } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import './HarvestList.scss';
const harvests = [
    { id: 'H01', date: '25/10/2025', cycle: '2025-HT', plot: 'Ruộng lúa ST25', quantity: '8.5 tấn', quality: 'Loại A', lots: 3 },
    { id: 'H02', date: '30/04/2026', cycle: '2026-DX-2', plot: 'Ruộng lúa nếp', quantity: '12 tấn (dự kiến)', quality: '—', lots: 0 },
    { id: 'H03', date: '15/05/2026', cycle: '2026-XH', plot: 'Ruộng cà chua', quantity: '3 tấn', quality: 'Loại B', lots: 2 },
];
const productLots = [
    { code: 'F01-VT01-2025HT-H01-P01', product: 'Gạo ST25 (5kg)', quantity: '2000 bao', date: '01/11/2025', qr: true },
    { code: 'F01-VT01-2025HT-H01-P02', product: 'Gạo ST25 (10kg)', quantity: '500 bao', date: '01/11/2025', qr: true },
    { code: 'F01-VT01-2025HT-H01-P03', product: 'Gạo ST25 (25kg)', quantity: '100 bao', date: '01/11/2025', qr: true },
    { code: 'F01-VT02-2026XH-H03-P01', product: 'Cà chua hữu cơ (1kg)', quantity: '3000 gói', date: '20/05/2026', qr: true },
    { code: 'F01-VT02-2026XH-H03-P02', product: 'Cà chua hữu cơ (3kg)', quantity: '500 gói', date: '20/05/2026', qr: true },
];
const harvestColumns = [
    { key: 'id', label: 'Mã', sortable: true, render: (v) => <strong>{v}</strong> },
    { key: 'date', label: 'Ngày', sortable: true },
    { key: 'cycle', label: 'Mùa vụ', render: (v) => <code className="cycle-code">{v}</code> },
    { key: 'plot', label: 'Vùng trồng' },
    { key: 'quantity', label: 'Sản lượng', render: (v) => <span style={{ fontWeight: 600 }}>{v}</span> },
    { key: 'quality', label: 'Phân loại' },
    {
        key: 'lots', label: 'Lô sản phẩm',
        render: (v) => v > 0
            ? <StatusBadge status="Active" label={`${v} lô`}/>
            : <StatusBadge status="Draft" label="Chưa tách"/>
    },
];
const lotColumns = [
    { key: 'code', label: 'Mã lô', render: (v) => <code style={{ fontSize: 12, fontWeight: 600 }}>{v}</code> },
    { key: 'product', label: 'Sản phẩm', render: (v) => <span style={{ fontWeight: 500 }}>{v}</span> },
    { key: 'quantity', label: 'Số lượng' },
    { key: 'date', label: 'Ngày đóng gói' },
    {
        key: 'qr', label: 'QR',
        render: (v) => v && <button className="btn btn--outline" style={{ fontSize: 12, padding: '4px 12px' }} onClick={() => window.addToast('Đang tạo file in QR Code...', 'success')}><QrCode size={14}/> In QR</button>
    },
];
const HarvestList = () => (<div className="page-container">
        <PageHeader title="Thu hoạch & Lô sản phẩm" subtitle="Quản lý thu hoạch, đóng gói và sinh mã truy xuất" actions={<button className="btn btn--primary" onClick={() => window.addToast('Tính năng tạo đợt thu hoạch đang phát triển', 'info')}><Plus size={16}/> Tạo đợt thu hoạch</button>}/>

        <h3 className="section-heading"><Wheat size={18}/> Đợt thu hoạch</h3>
        <DataTable columns={harvestColumns} data={harvests} pageSize={5}/>

        <h3 className="section-heading" style={{ marginTop: 24 }}><QrCode size={18}/> Lô sản phẩm</h3>
        <DataTable columns={lotColumns} data={productLots} pageSize={5}/>
    </div>);
export default HarvestList;
