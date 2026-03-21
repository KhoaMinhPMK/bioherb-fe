import React, { useState, useMemo } from 'react';
import { Plus, Sprout } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import FilterBar from '../../components/FilterBar';
import StatusBadge from '../../components/StatusBadge';
import ProgressBar from '../../components/ProgressBar';
import DetailDrawer from '../../components/DetailDrawer';
const allCycles = [
    { id: '2026-DX', plot: 'Ruộng lúa ST25', plotId: 'VT01', crop: 'Lúa ST25', start: '01/01/2026', end: '25/05/2026', status: 'Active', progress: 65, cost: 15200000, costDisplay: '15.200.000' },
    { id: '2026-XH', plot: 'Ruộng cà chua', plotId: 'VT02', crop: 'Cà chua', start: '15/02/2026', end: '15/06/2026', status: 'Active', progress: 40, cost: 8500000, costDisplay: '8.500.000' },
    { id: '2026-DX-2', plot: 'Ruộng lúa nếp', plotId: 'VT03', crop: 'Lúa nếp', start: '01/01/2026', end: '30/04/2026', status: 'Harvesting', progress: 95, cost: 22100000, costDisplay: '22.100.000' },
    { id: '2025-HT', plot: 'Ruộng lúa ST25', plotId: 'VT01', crop: 'Lúa ST25', start: '01/06/2025', end: '25/10/2025', status: 'Closed', progress: 100, cost: 18800000, costDisplay: '18.800.000' },
];
const columns = [
    { key: 'id', label: 'Mã', sortable: true, width: '100px', render: (val) => <strong>{val}</strong> },
    { key: 'plot', label: 'Vùng trồng', sortable: true },
    {
        key: 'crop', label: 'Cây trồng', sortable: true,
        render: (val) => (<span className="crop-cycle__crop-cell">
                <Sprout size={14} aria-hidden="true"/>
                {val}
            </span>)
    },
    { key: 'start', label: 'Bắt đầu', sortable: true, width: '100px' },
    { key: 'end', label: 'Kết thúc', sortable: true, width: '100px' },
    {
        key: 'progress', label: 'Tiến độ', sortable: true, width: '140px',
        render: (val) => <ProgressBar value={val} size="sm"/>
    },
    {
        key: 'cost', label: 'Chi phí', sortable: true,
        render: (_, row) => <span className="crop-cycle__cost">{row.costDisplay} ₫</span>
    },
    {
        key: 'status', label: 'Trạng thái', sortable: true,
        render: (val) => <StatusBadge status={val}/>
    },
];
const filterConfigs = [
    {
        key: 'status',
        label: 'Trạng thái',
        options: [
            { value: 'Active', label: 'Active' },
            { value: 'Harvesting', label: 'Harvesting' },
            { value: 'Closed', label: 'Closed' },
        ]
    },
];
const CropCycleList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({});
    const [selectedCycle, setSelectedCycle] = useState(null);
    const filteredCycles = useMemo(() => {
        return allCycles.filter((c) => {
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const match = c.id.toLowerCase().includes(term)
                    || c.plot.toLowerCase().includes(term)
                    || c.crop.toLowerCase().includes(term);
                if (!match)
                    return false;
            }
            if (filters.status && c.status !== filters.status)
                return false;
            return true;
        });
    }, [searchTerm, filters]);
    return (<div className="page-container">
            <PageHeader title="Mùa vụ" subtitle="Quản lý mùa vụ theo vùng trồng" actions={<button className="btn btn--primary">
                        <Plus size={16}/> Tạo mùa vụ
                    </button>}/>

            <FilterBar searchPlaceholder="Tìm mùa vụ..." onSearch={setSearchTerm} filters={filterConfigs} onFilterChange={setFilters}/>

            <div className="card">
                <DataTable columns={columns} data={filteredCycles} pageSize={10} onRowClick={(row) => setSelectedCycle(row)}/>
            </div>

            <DetailDrawer isOpen={!!selectedCycle} onClose={() => setSelectedCycle(null)} title={selectedCycle ? `Mùa vụ ${selectedCycle.id}` : ''}>
                {selectedCycle && (<div className="crop-cycle__detail">
                        <div className="crop-cycle__detail-grid">
                            <div className="crop-cycle__detail-field">
                                <label>Mã mùa vụ</label>
                                <strong>{selectedCycle.id}</strong>
                            </div>
                            <div className="crop-cycle__detail-field">
                                <label>Trạng thái</label>
                                <StatusBadge status={selectedCycle.status}/>
                            </div>
                            <div className="crop-cycle__detail-field">
                                <label>Vùng trồng</label>
                                <span>{selectedCycle.plot} ({selectedCycle.plotId})</span>
                            </div>
                            <div className="crop-cycle__detail-field">
                                <label>Cây trồng</label>
                                <span>{selectedCycle.crop}</span>
                            </div>
                            <div className="crop-cycle__detail-field">
                                <label>Bắt đầu</label>
                                <span>{selectedCycle.start}</span>
                            </div>
                            <div className="crop-cycle__detail-field">
                                <label>Kết thúc</label>
                                <span>{selectedCycle.end}</span>
                            </div>
                            <div className="crop-cycle__detail-field">
                                <label>Tiến độ</label>
                                <ProgressBar value={selectedCycle.progress} size="md"/>
                            </div>
                            <div className="crop-cycle__detail-field">
                                <label>Chi phí</label>
                                <span className="crop-cycle__cost">{selectedCycle.costDisplay} ₫</span>
                            </div>
                        </div>
                    </div>)}
            </DetailDrawer>
        </div>);
};
export default CropCycleList;
