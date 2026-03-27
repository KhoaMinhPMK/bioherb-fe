import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Sprout, Users, BarChart3, Wheat } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import ProgressBar from '../../components/ProgressBar';
import { useData } from '../../contexts/DataContext';
import './FarmDetail.scss';

const FarmDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { farms, plots, cropCycles, workers: workersList, harvestBatches } = useData();

    const farm = useMemo(() => farms.find((f) => f.id === id), [id, farms]);
    const farmPlots = useMemo(() => plots.filter((p) => p.farmId === id), [id, plots]);
    const farmCycles = useMemo(() => {
        const plotIds = farmPlots.map((p) => p.id);
        return cropCycles.filter((c) => plotIds.includes(c.plotId));
    }, [farmPlots, cropCycles]);
    const farmWorkers = useMemo(() => workersList.filter((w) => w.farmId === id), [id, workersList]);
    const farmHarvest = useMemo(() => {
        const plotIds = farmPlots.map((p) => p.id);
        return harvestBatches.filter((h) => plotIds.includes(h.plotId));
    }, [farmPlots, harvestBatches]);
    const totalHarvestKg = useMemo(() => farmHarvest.reduce((s, h) => s + (h.quantityKg || 0), 0), [farmHarvest]);
    const totalArea = useMemo(() => farmPlots.reduce((s, p) => s + (p.area || 0), 0), [farmPlots]);

    const plotColumns = [
        { key: 'name', label: 'Tên', sortable: true, render: (v) => <strong>{v}</strong> },
        { key: 'area', label: 'Diện tích (ha)', width: '120px' },
        { key: 'soilType', label: 'Loại đất', hideOnMobile: true },
        { key: 'status', label: 'TT', render: (v) => <StatusBadge status={v || 'Active'} /> },
    ];

    const cycleColumns = [
        { key: 'id', label: 'Mã', width: '100px' },
        { key: 'crop', label: 'Cây trồng' },
        { key: 'progress', label: 'Tiến độ', render: (v) => <ProgressBar value={v} size="sm" /> },
        { key: 'status', label: 'TT', render: (v) => <StatusBadge status={v} /> },
    ];

    if (!farm) {
        return (
            <div className="page-container">
                <PageHeader title="Không tìm thấy Farm" />
                <button className="btn btn--outline" onClick={() => navigate('/farms')}>
                    <ArrowLeft size={16} /> Quay lại
                </button>
            </div>
        );
    }

    const stats = [
        { icon: MapPin, label: 'Vùng trồng', value: farmPlots.length },
        { icon: Sprout, label: 'Mùa vụ', value: farmCycles.length },
        { icon: Users, label: 'Nhân công', value: farmWorkers.length },
        { icon: Wheat, label: 'Sản lượng (kg)', value: totalHarvestKg.toLocaleString('vi-VN') },
        { icon: BarChart3, label: 'Tổng diện tích (ha)', value: totalArea },
    ];

    return (
        <div className="page-container">
            <PageHeader
                title={farm.name}
                subtitle={farm.address || ''}
                actions={
                    <button className="btn-icon" onClick={() => navigate('/farms')} aria-label="Quay lại">
                        <ArrowLeft size={20} />
                    </button>
                }
            />

            <div className="farm-detail__stats">
                {stats.map((s) => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="card">
                            <div className="card__body farm-detail__stat-card">
                                <Icon size={20} className="farm-detail__stat-icon" />
                                <div>
                                    <span className="farm-detail__stat-label">{s.label}</span>
                                    <p className="farm-detail__stat-value">{s.value}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="card">
                <div className="card__header">
                    <h3 className="font-semibold">Vùng trồng ({farmPlots.length})</h3>
                </div>
                <DataTable
                    columns={plotColumns}
                    data={farmPlots}
                    pageSize={5}
                    onRowClick={(row) => navigate(`/plots/${row.id}`)}
                />
            </div>

            <div className="card">
                <div className="card__header">
                    <h3 className="font-semibold">Mùa vụ ({farmCycles.length})</h3>
                </div>
                <DataTable
                    columns={cycleColumns}
                    data={farmCycles}
                    pageSize={5}
                    onRowClick={(row) => navigate(`/crop-cycles/${row.id}`)}
                />
            </div>
        </div>
    );
};

export default FarmDetail;
