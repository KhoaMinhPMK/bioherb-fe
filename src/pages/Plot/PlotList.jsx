import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MapPin } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import FilterBar from '../../components/FilterBar';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import DetailDrawer from '../../components/DetailDrawer';
import { useAuth } from '../../contexts/AuthContext';
import { plots as allPlots, getPlotsByFarm, farms } from '../../data/mockData';
import './PlotList.scss';

const statusFilter = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'active', label: 'Hoạt động' },
    { value: 'idle', label: 'Tạm nghỉ' },
];

const PlotList = () => {
    const navigate = useNavigate();
    const { currentFarm, canSeeAllFarms } = useAuth();
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ status: '' });
    const [selected, setSelected] = useState(null);

    // Use real mock data, scoped to farm
    const plotData = useMemo(() => {
        if (canSeeAllFarms()) return allPlots;
        if (!currentFarm) return [];
        return getPlotsByFarm(currentFarm.id);
    }, [currentFarm, canSeeAllFarms]);

    // Sort by code (A-B-C) by default, then filter
    const filtered = useMemo(() => {
        let data = [...plotData].sort((a, b) => a.id.localeCompare(b.id));
        if (search) {
            const s = search.toLowerCase();
            data = data.filter(
                (p) =>
                    p.id.toLowerCase().includes(s) ||
                    p.name.toLowerCase().includes(s) ||
                    p.crop.toLowerCase().includes(s)
            );
        }
        if (filters.status) {
            data = data.filter((p) => p.status === filters.status);
        }
        return data;
    }, [plotData, search, filters]);

    // Build columns — hide Farm column when in single-farm context
    const columns = useMemo(() => {
        const cols = [
            { key: 'id', label: 'Mã', sortable: true, render: (v) => <strong>{v}</strong> },
            {
                key: 'name',
                label: 'Tên vùng',
                sortable: true,
                render: (v) => (
                    <span className="plot-cell">
                        <MapPin size={14} className="plot-cell__icon" />
                        {v}
                    </span>
                ),
            },
        ];

        // Only show Farm column when user can see all farms (admin/htx view)
        if (canSeeAllFarms()) {
            cols.push({
                key: 'farmId',
                label: 'Farm',
                sortable: true,
                render: (v) => {
                    const farm = farms.find((f) => f.id === v);
                    return farm ? farm.name : v;
                },
                hideOnMobile: true,
            });
        }

        cols.push(
            { key: 'area', label: 'Diện tích', sortable: true, hideOnMobile: true },
            { key: 'crop', label: 'Cây trồng' },
            {
                key: 'activeCycle',
                label: 'Mùa vụ',
                render: (v) =>
                    v ? <code className="cycle-code">{v}</code> : <span className="text-muted">—</span>,
                hideOnMobile: true,
            },
            {
                key: 'status',
                label: 'Trạng thái',
                render: (v) => <StatusBadge status={v} />,
            }
        );

        return cols;
    }, [canSeeAllFarms]);

    const handleRowClick = (row) => {
        navigate(`/plots/${row.id}`);
    };

    return (
        <div className="page-container">
            <PageHeader
                title="Vùng trồng"
                subtitle="Quản lý mã vùng, diện tích, vị trí và mùa vụ"
                actions={
                    <button className="btn btn--primary">
                        <Plus size={16} /> Thêm vùng trồng
                    </button>
                }
            />
            <FilterBar
                onSearch={setSearch}
                searchPlaceholder="Tìm theo mã hoặc tên vùng..."
                filters={[
                    { key: 'status', label: 'Trạng thái', options: statusFilter },
                ]}
                onFilterChange={(f) => setFilters((prev) => ({ ...prev, ...f }))}
            />
            <DataTable
                columns={columns}
                data={filtered}
                onRowClick={handleRowClick}
                pageSize={8}
            />

            <DetailDrawer
                isOpen={!!selected}
                onClose={() => setSelected(null)}
                title={selected ? `Vùng trồng ${selected.id}` : ''}
            >
                {selected && (
                    <div className="drawer-detail-grid">
                        <div className="drawer-detail-grid__label">Mã</div>
                        <div className="drawer-detail-grid__value">{selected.id}</div>
                        <div className="drawer-detail-grid__label">Tên vùng</div>
                        <div className="drawer-detail-grid__value">{selected.name}</div>
                        <div className="drawer-detail-grid__label">Diện tích</div>
                        <div className="drawer-detail-grid__value">{selected.area}</div>
                        <div className="drawer-detail-grid__label">Cây trồng</div>
                        <div className="drawer-detail-grid__value">{selected.crop}</div>
                        <div className="drawer-detail-grid__label">Toạ độ</div>
                        <div className="drawer-detail-grid__value">
                            {selected.coords || 'Chưa cập nhật'}
                        </div>
                        <div className="drawer-detail-grid__label">Trạng thái</div>
                        <div className="drawer-detail-grid__value">
                            <StatusBadge status={selected.status} />
                        </div>
                    </div>
                )}
            </DetailDrawer>
        </div>
    );
};
export default PlotList;
