import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Edit2,
    MapPin,
    Info,
    LayoutGrid,
    Sprout,
    FlaskConical,
    Bug,
    Leaf,
    Wheat,
    Factory,
    Target,
    Navigation,
    Plus,
} from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import TabNav from '../../components/TabNav';
import { useToast } from '../../contexts/ToastContext';
import { useData } from '../../contexts/DataContext';
import { JOURNAL_TYPE, PEST_SEVERITY_LABEL, PEST_SEVERITY_VARIANT, SHIFT_LABEL } from '../../constants';
import {
    SeedJournalForm,
    FertilizerJournalForm,
    PestJournalForm,
    FarmingJournalForm,
    HarvestJournalForm,
    ProcessingJournalForm,
} from '../Journal/JournalForms';
import './PlotDetail.scss';

// --- Tab definitions ---
const TAB_DEFS = [
    { key: 'overview', label: 'Tổng quan', icon: Info },
    { key: 'seed', label: 'Giống', icon: Sprout },
    { key: 'fertilizer', label: 'Phân bón', icon: FlaskConical },
    { key: 'pest', label: 'Sâu bệnh', icon: Bug },
    { key: 'farming', label: 'Canh tác', icon: Leaf },
    { key: 'harvest', label: 'Thu hoạch', icon: Wheat },
    { key: 'processing', label: 'Sơ chế', icon: Factory },
];

// --- Cycle history columns ---
const cycleColumns = [
    { key: 'id', label: 'Mã mùa vụ', render: (v) => <strong>{v}</strong> },
    { key: 'crop', label: 'Cây trồng' },
    { key: 'start', label: 'Bắt đầu', hideOnMobile: true },
    { key: 'end', label: 'Kết thúc', hideOnMobile: true },
    { key: 'progress', label: 'Tiến độ', render: (v) => `${v}%`, hideOnMobile: true },
    { key: 'status', label: 'Trạng thái', render: (v) => <StatusBadge status={v} /> },
];

// --- Journal list columns (generic) ---
const journalColumns = [
    { key: 'date', label: 'Ngày' },
    { key: 'task', label: 'Công việc' },
    { key: 'workerName', label: 'Người thực hiện', hideOnMobile: true },
    {
        key: 'shift',
        label: 'Buổi',
        render: (v) => <span className="plot-detail__shift">{SHIFT_LABEL[v] || v}</span>,
    },
    { key: 'status', label: 'Trạng thái', render: (v) => <StatusBadge status={v} /> },
];

// --- Pest journal columns ---
const pestColumns = [
    { key: 'date', label: 'Ngày phát hiện' },
    { key: 'type', label: 'Loại' },
    {
        key: 'severity',
        label: 'Mức độ',
        render: (v) => {
            const cls = PEST_SEVERITY_VARIANT[v] || 'info';
            const label = PEST_SEVERITY_LABEL[v] || v;
            return <StatusBadge status={cls} label={label} />;
        },
    },
    { key: 'treatment', label: 'Xử lý', hideOnMobile: true },
    { key: 'harvestSafe', label: 'Ngày an toàn thu hoạch', hideOnMobile: true },
    { key: 'status', label: 'Trạng thái', render: (v) => <StatusBadge status={v} /> },
];

// --- Harvest columns ---
const harvestColumns = [
    { key: 'date', label: 'Ngày' },
    { key: 'quantity', label: 'Sản lượng' },
    { key: 'quality', label: 'Chất lượng', hideOnMobile: true },
    { key: 'lotCode', label: 'Mã lô', render: (v) => <code className="cycle-code">{v}</code> },
    {
        key: 'isolationOk',
        label: 'Cách ly',
        render: (v) =>
            v ? (
                <span className="plot-detail__badge plot-detail__badge--ok">✅ Đạt</span>
            ) : (
                <span className="plot-detail__badge plot-detail__badge--warn">⚠️ Chưa đạt</span>
            ),
    },
    { key: 'status', label: 'Trạng thái', render: (v) => <StatusBadge status={v} /> },
];

const PlotDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { plots, farms, harvestBatches, getCyclesByPlot, getLogsByPlot, getPestByPlot } = useData();
    const [activeTab, setActiveTab] = useState('overview');
    const [openForm, setOpenForm] = useState(null); // 'seed' | 'fertilizer' | etc.

    // Find plot data
    const plot = useMemo(() => plots.find((p) => p.id === id), [id, plots]);
    const farm = useMemo(() => (plot ? farms.find((f) => f.id === plot.farmId) : null), [plot, farms]);
    const cycles = useMemo(() => getCyclesByPlot(id), [id, getCyclesByPlot]);
    const logs = useMemo(() => getLogsByPlot(id), [id, getLogsByPlot]);
    const pests = useMemo(() => getPestByPlot(id), [id, getPestByPlot]);
    const harvests = useMemo(() => harvestBatches.filter((h) => h.plotId === id), [id, harvestBatches]);

    // Filter logs by journal type
    const seedLogs = logs.filter((l) => l.type === JOURNAL_TYPE.SEED);
    const fertilizerLogs = logs.filter((l) => l.type === JOURNAL_TYPE.FERTILIZER);
    const farmingLogs = logs.filter((l) => l.type === JOURNAL_TYPE.FARMING);

    // Tab counts
    const tabsWithCounts = TAB_DEFS.map((tab) => {
        let count;
        switch (tab.key) {
            case 'seed':
                count = seedLogs.length;
                break;
            case 'fertilizer':
                count = fertilizerLogs.length;
                break;
            case 'pest':
                count = pests.length;
                break;
            case 'farming':
                count = farmingLogs.length;
                break;
            case 'harvest':
                count = harvests.length;
                break;
            default:
                count = undefined;
        }
        return { ...tab, count };
    });

    if (!plot) {
        return (
            <div className="page-container">
                <PageHeader title="Vùng trồng không tồn tại" />
                <button className="btn btn--outline" onClick={() => navigate('/plots')}>
                    <ArrowLeft size={16} /> Quay lại danh sách
                </button>
            </div>
        );
    }

    const renderAddButton = (formKey, label) => (
        <button className="btn btn--primary btn--sm plot-detail__add-btn" onClick={() => setOpenForm(formKey)}>
            <Plus size={14} /> Thêm {label}
        </button>
    );

    const renderEmptyState = (formKey, label) => (
        <div className="empty-state">
            <div className="empty-state__icon">
                <Info size={40} />
            </div>
            <h3 className="empty-state__title">Chưa có dữ liệu</h3>
            <p className="empty-state__description">Vùng trồng này chưa ghi nhận {label} nào.</p>
            <button className="btn btn--outline plot-detail__empty-add-btn" onClick={() => setOpenForm(formKey)}>
                <Plus size={16} /> Thêm {label}
            </button>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <>
                        {/* Plot info card */}
                        <div className="card">
                            <div className="card__body">
                                <div className="detail-grid">
                                    <div className="detail-field">
                                        <label>
                                            <Info size={14} /> Mã vùng
                                        </label>
                                        <span className="plot-detail__value">{plot.id}</span>
                                    </div>
                                    <div className="detail-field">
                                        <label>
                                            <LayoutGrid size={14} /> Tên vùng
                                        </label>
                                        <span className="plot-detail__value">{plot.name}</span>
                                    </div>
                                    <div className="detail-field">
                                        <label>
                                            <Target size={14} /> Farm
                                        </label>
                                        <span className="plot-detail__value">{farm?.name || '—'}</span>
                                    </div>
                                    <div className="detail-field">
                                        <label>
                                            <LayoutGrid size={14} /> Diện tích
                                        </label>
                                        <span className="plot-detail__value">{plot.area}</span>
                                    </div>
                                    <div className="detail-field">
                                        <label>
                                            <Sprout size={14} /> Cây trồng
                                        </label>
                                        <span className="plot-detail__value">{plot.crop}</span>
                                    </div>
                                    <div className="detail-field">
                                        <label>
                                            <Navigation size={14} /> Toạ độ
                                        </label>
                                        <span className="plot-detail__value">{plot.coords || 'Chưa cập nhật'}</span>
                                    </div>
                                    <div className="detail-field">
                                        <label>
                                            <MapPin size={14} /> Trạng thái
                                        </label>
                                        <StatusBadge status={plot.status} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cycle history */}
                        <h3 className="plot-detail__section-title">Lịch sử mùa vụ</h3>
                        <div className="card">
                            <DataTable columns={cycleColumns} data={cycles} pageSize={5} />
                        </div>
                    </>
                );

            case 'seed':
                return (
                    <>
                        {renderAddButton('seed', 'nhật ký giống')}
                        {seedLogs.length > 0 ? (
                            <div className="card">
                                <DataTable columns={journalColumns} data={seedLogs} pageSize={10} />
                            </div>
                        ) : (
                            renderEmptyState('seed', 'nhật ký giống')
                        )}
                    </>
                );

            case 'fertilizer':
                return (
                    <>
                        {renderAddButton('fertilizer', 'nhật ký phân bón')}
                        {fertilizerLogs.length > 0 ? (
                            <div className="card">
                                <DataTable columns={journalColumns} data={fertilizerLogs} pageSize={10} />
                            </div>
                        ) : (
                            renderEmptyState('fertilizer', 'nhật ký phân bón')
                        )}
                    </>
                );

            case 'pest':
                return (
                    <>
                        {renderAddButton('pest', 'nhật ký sâu bệnh')}
                        {pests.length > 0 ? (
                            <div className="card">
                                <DataTable columns={pestColumns} data={pests} pageSize={10} />
                            </div>
                        ) : (
                            renderEmptyState('pest', 'nhật ký sâu bệnh')
                        )}
                    </>
                );

            case 'farming':
                return (
                    <>
                        {renderAddButton('farming', 'nhật ký canh tác')}
                        {farmingLogs.length > 0 ? (
                            <div className="card">
                                <DataTable columns={journalColumns} data={farmingLogs} pageSize={10} />
                            </div>
                        ) : (
                            renderEmptyState('farming', 'nhật ký canh tác')
                        )}
                    </>
                );

            case 'harvest':
                return (
                    <>
                        {renderAddButton('harvest', 'nhật ký thu hoạch')}
                        {harvests.length > 0 ? (
                            <div className="card">
                                <DataTable columns={harvestColumns} data={harvests} pageSize={10} />
                            </div>
                        ) : (
                            renderEmptyState('harvest', 'nhật ký thu hoạch')
                        )}
                    </>
                );

            case 'processing':
                return (
                    <>
                        {renderAddButton('processing', 'nhật ký sơ chế')}
                        {renderEmptyState('processing', 'nhật ký sơ chế')}
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className="page-container">
            <PageHeader
                title={`${plot.id} — ${plot.name}`}
                subtitle={`${farm?.name || ''} · ${plot.area} · ${plot.crop}`}
                actions={
                    <>
                        <button className="btn-icon" onClick={() => navigate('/plots')} aria-label="Quay lại">
                            <ArrowLeft size={20} />
                        </button>
                        <button
                            className="btn btn--outline"
                            onClick={() => addToast('Chỉnh sửa đang phát triển', 'info')}
                        >
                            <Edit2 size={16} /> Chỉnh sửa
                        </button>
                    </>
                }
            />

            {/* Tab Navigation */}
            <TabNav tabs={tabsWithCounts} active={activeTab} onChange={setActiveTab} />

            {/* Tab Content */}
            <div className="plot-detail__content" role="tabpanel" id={`tabpanel-${activeTab}`}>
                {renderTabContent()}
            </div>

            {/* Journal Form Drawers */}
            <SeedJournalForm isOpen={openForm === 'seed'} onClose={() => setOpenForm(null)} plotId={id} />
            <FertilizerJournalForm isOpen={openForm === 'fertilizer'} onClose={() => setOpenForm(null)} plotId={id} />
            <PestJournalForm isOpen={openForm === 'pest'} onClose={() => setOpenForm(null)} plotId={id} />
            <FarmingJournalForm isOpen={openForm === 'farming'} onClose={() => setOpenForm(null)} plotId={id} />
            <HarvestJournalForm isOpen={openForm === 'harvest'} onClose={() => setOpenForm(null)} plotId={id} />
            <ProcessingJournalForm isOpen={openForm === 'processing'} onClose={() => setOpenForm(null)} plotId={id} />
        </div>
    );
};

export default PlotDetail;
