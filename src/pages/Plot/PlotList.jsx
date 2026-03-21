import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MapPin } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import FilterBar from '../../components/FilterBar';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import DetailDrawer from '../../components/DetailDrawer';
import './PlotList.scss';
const plots = [
    { id: 'VT01', name: 'Ruộng lúa ST25', farm: 'Farm Long An', area: '2 ha', crop: 'Lúa ST25', status: 'Active', cycle: '2026-DX' },
    { id: 'VT02', name: 'Ruộng cà chua', farm: 'Farm Long An', area: '1 ha', crop: 'Cà chua', status: 'Active', cycle: '2026-XH' },
    { id: 'VT03', name: 'Ruộng lúa nếp', farm: 'Farm Đồng Tháp', area: '3 ha', crop: 'Lúa nếp', status: 'Active', cycle: '2026-DX' },
    { id: 'VT04', name: 'Vườn rau', farm: 'Farm Tiền Giang', area: '0.5 ha', crop: 'Rau muống', status: 'Draft', cycle: '—' },
    { id: 'VT05', name: 'Ruộng bắp', farm: 'Farm Đồng Tháp', area: '1.5 ha', crop: 'Bắp', status: 'Closed', cycle: '2025-HT' },
    { id: 'VT06', name: 'Ruộng lúa Jasmine', farm: 'Farm Long An', area: '2.5 ha', crop: 'Lúa Jasmine', status: 'Active', cycle: '2026-DX' },
    { id: 'VT07', name: 'Vườn ổi', farm: 'Farm Tiền Giang', area: '0.3 ha', crop: 'Ổi', status: 'Active', cycle: '2026-XH' },
    { id: 'VT08', name: 'Ruộng sen', farm: 'Farm Đồng Tháp', area: '1 ha', crop: 'Sen', status: 'Draft', cycle: '—' },
];
const statusFilter = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'Active', label: 'Active' },
    { value: 'Draft', label: 'Draft' },
    { value: 'Closed', label: 'Closed' },
];
const columns = [
    { key: 'id', label: 'Mã', sortable: true, render: (v) => <strong>{v}</strong> },
    {
        key: 'name', label: 'Tên vùng', sortable: true,
        render: (v) => (<span className="plot-cell"><MapPin size={14} className="plot-cell__icon"/>{v}</span>)
    },
    { key: 'farm', label: 'Farm', sortable: true },
    { key: 'area', label: 'Diện tích', sortable: true },
    { key: 'crop', label: 'Cây trồng' },
    {
        key: 'cycle', label: 'Mùa vụ',
        render: (v) => <code className="cycle-code">{v}</code>
    },
    {
        key: 'status', label: 'Trạng thái',
        render: (v) => <StatusBadge status={v}/>
    },
];
const PlotList = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ status: '' });
    const [selected, setSelected] = useState(null);
    const filtered = useMemo(() => {
        let data = plots;
        if (search) {
            const s = search.toLowerCase();
            data = data.filter(p => p.id.toLowerCase().includes(s) ||
                p.name.toLowerCase().includes(s) ||
                p.farm.toLowerCase().includes(s) ||
                p.crop.toLowerCase().includes(s));
        }
        if (filters.status) {
            data = data.filter(p => p.status === filters.status);
        }
        return data;
    }, [search, filters]);
    return (<div className="page-container">
            <PageHeader title="Vùng trồng" subtitle="Quản lý mã vùng, diện tích, vị trí và mùa vụ" actions={<button className="btn btn--primary"><Plus size={16}/> Thêm vùng trồng</button>}/>
            <FilterBar onSearch={setSearch} searchPlaceholder="Tìm vùng trồng..." filters={[{ key: 'status', label: 'Trạng thái', options: statusFilter }]} onFilterChange={(f) => setFilters(prev => ({ ...prev, ...f }))}/>
            <DataTable columns={columns} data={filtered} onRowClick={(row) => setSelected(row)} pageSize={5}/>

            <DetailDrawer isOpen={!!selected} onClose={() => setSelected(null)} title={selected ? `Vùng trồng ${selected.id}` : ''}>
                {selected && (<div className="drawer-detail-grid">
                        <div className="drawer-detail-grid__label">Mã</div>
                        <div className="drawer-detail-grid__value">{selected.id}</div>
                        <div className="drawer-detail-grid__label">Tên vùng</div>
                        <div className="drawer-detail-grid__value">{selected.name}</div>
                        <div className="drawer-detail-grid__label">Farm</div>
                        <div className="drawer-detail-grid__value">{selected.farm}</div>
                        <div className="drawer-detail-grid__label">Diện tích</div>
                        <div className="drawer-detail-grid__value">{selected.area}</div>
                        <div className="drawer-detail-grid__label">Cây trồng</div>
                        <div className="drawer-detail-grid__value">{selected.crop}</div>
                        <div className="drawer-detail-grid__label">Mùa vụ</div>
                        <div className="drawer-detail-grid__value"><code className="cycle-code">{selected.cycle}</code></div>
                        <div className="drawer-detail-grid__label">Trạng thái</div>
                        <div className="drawer-detail-grid__value"><StatusBadge status={selected.status}/></div>
                    </div>)}
            </DetailDrawer>
        </div>);
};
export default PlotList;
