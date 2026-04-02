import React, { useState, useMemo, useCallback } from 'react';
import { Plus, FileDown, Table, LayoutList, BookOpenCheck } from 'lucide-react';
import { GACP_ENTRY_TYPES, GACP_TYPE_MAP } from './gacpConstants';
import GACPTypeSelector from './components/GACPTypeSelector';
import GACPEntryCard from './components/GACPEntryCard';
import {
    SeedProductionForm,
    LandHistoryForm,
    SoilConditionForm,
    WaterPollutionForm,
    WaterTreatmentForm,
} from './GACPFormsLand';
import { OrganicFertilizerForm, ChemicalOriginForm, ChemicalUsageForm, ChemicalDisposalForm } from './GACPFormsChem';
import {
    DailyCareForm,
    PestTrackingForm,
    HarvestTrackingForm,
    WasteManagementForm,
    EquipmentUsageForm,
    IncidentTrackingForm,
} from './GACPFormsOps';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { exportGacpPdf } from './gacpPdfExport';
import './GACPDiaryPage.scss';

// Map type → form component
const FORM_MAP = {
    seed_production: SeedProductionForm,
    land_history: LandHistoryForm,
    soil_condition: SoilConditionForm,
    water_pollution: WaterPollutionForm,
    water_treatment: WaterTreatmentForm,
    organic_fertilizer: OrganicFertilizerForm,
    chemical_origin: ChemicalOriginForm,
    chemical_usage: ChemicalUsageForm,
    chemical_disposal: ChemicalDisposalForm,
    daily_care: DailyCareForm,
    pest_tracking: PestTrackingForm,
    harvest: HarvestTrackingForm,
    waste_management: WasteManagementForm,
    equipment_usage: EquipmentUsageForm,
    incident: IncidentTrackingForm,
};

/**
 * GACPDiaryPage — Main page for GACP-WHO cultivation zone diary.
 * Notebook-style timeline UX optimized for non-tech-savvy farmers.
 */
function GACPDiaryPage() {
    const { gacpEntries, plots, users, deleteGacpEntry, farms, cooperatives } = useData();
    const { currentUser } = useAuth();
    const { addToast } = useToast();

    // Build cover data from real farm/cooperative context
    const gacpCoverData = useMemo(() => {
        const farm = farms.find((f) => f.id === currentUser?.farmId) || farms[0];
        const coop = cooperatives.find((c) => c.id === (farm?.htxId || currentUser?.htxId)) || cooperatives[0];
        return {
            companyName: coop?.name || farm?.name || 'SANKIT',
            zoneName: farm?.name || 'Vùng trồng dược liệu',
            address: farm?.address || coop?.address || '',
            issueDate: new Date().toISOString().slice(0, 10),
            lotCode: '',
            herbName: '',
        };
    }, [farms, cooperatives, currentUser]);

    // ─── State ──────────────────────────────────
    const [selectedPlot, setSelectedPlot] = useState('all');
    const [activeFilter, setActiveFilter] = useState(null);
    const [selectorOpen, setSelectorOpen] = useState(false);
    const [activeFormType, setActiveFormType] = useState(null);
    const [editEntry, setEditEntry] = useState(null);
    const [viewMode, setViewMode] = useState('timeline'); // timeline | table

    // ─── Filtered & Sorted Entries ──────────────
    const filteredEntries = useMemo(() => {
        let entries = [...gacpEntries];
        if (selectedPlot !== 'all') entries = entries.filter((e) => e.plotId === selectedPlot);
        if (activeFilter) entries = entries.filter((e) => e.type === activeFilter);
        return entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [gacpEntries, selectedPlot, activeFilter]);

    // ─── Group by date ──────────────────────────
    const groupedEntries = useMemo(() => {
        const groups = {};
        const todayStr = new Date().toISOString().slice(0, 10);
        const yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        filteredEntries.forEach((entry) => {
            let label = entry.date;
            if (entry.date === todayStr) label = 'Hôm nay';
            else if (entry.date === yesterdayStr) label = 'Hôm qua';
            else
                label = new Date(entry.date).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });
            if (!groups[label]) groups[label] = [];
            groups[label].push(entry);
        });
        return groups;
    }, [filteredEntries]);

    // ─── Handlers ───────────────────────────────
    const handleTypeSelect = useCallback((typeId) => {
        setEditEntry(null);
        setActiveFormType(typeId);
    }, []);

    const handleEdit = useCallback((entry) => {
        setEditEntry(entry);
        setActiveFormType(entry.type);
    }, []);

    const handleDelete = useCallback(
        async (id) => {
            await deleteGacpEntry(id);
            addToast('Đã xóa mục nhật ký', 'success');
        },
        [deleteGacpEntry, addToast],
    );

    const handleFormClose = useCallback(() => {
        setActiveFormType(null);
        setEditEntry(null);
    }, []);

    const toggleFilter = useCallback((typeId) => {
        setActiveFilter((prev) => (prev === typeId ? null : typeId));
    }, []);

    const handleExportPdf = useCallback(async () => {
        try {
            addToast('Đang tạo PDF...', 'info');
            const fileName = await exportGacpPdf(
                gacpCoverData,
                filteredEntries,
                activeFilter ? { filterType: activeFilter } : {},
            );
            addToast(`Đã xuất ${fileName}`, 'success');
        } catch (err) {
            addToast('Lỗi xuất PDF: ' + err.message, 'error');
        }
    }, [filteredEntries, activeFilter, gacpCoverData, addToast]);

    // ─── Active Form Component ──────────────────
    const ActiveForm = activeFormType ? FORM_MAP[activeFormType] : null;
    const currentPlotId = selectedPlot === 'all' ? plots[0]?.id || 'P01' : selectedPlot;

    return (
        <div className="gacp-diary">
            {/* ── Header ─────────────────────────── */}
            <div className="gacp-diary__header">
                <div className="gacp-diary__header-left">
                    <BookOpenCheck size={24} className="gacp-diary__header-icon" />
                    <div>
                        <h1 className="gacp-diary__title">Nhật ký vùng trồng</h1>
                        <p className="gacp-diary__subtitle">GACP — WHO</p>
                    </div>
                </div>
                <div className="gacp-diary__header-actions">
                    <button
                        className="btn btn--outline btn--sm"
                        onClick={() => setViewMode((v) => (v === 'timeline' ? 'table' : 'timeline'))}
                    >
                        {viewMode === 'timeline' ? (
                            <>
                                <Table size={16} /> Bảng
                            </>
                        ) : (
                            <>
                                <LayoutList size={16} /> Timeline
                            </>
                        )}
                    </button>
                    <button className="btn btn--outline btn--sm" onClick={handleExportPdf}>
                        <FileDown size={16} /> Xuất PDF
                    </button>
                </div>
            </div>

            {/* ── Plot Selector ───────────────────── */}
            <div className="gacp-diary__toolbar">
                <select
                    className="gacp-diary__plot-select"
                    value={selectedPlot}
                    onChange={(e) => setSelectedPlot(e.target.value)}
                >
                    <option value="all">Tất cả vùng trồng</option>
                    {plots.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>
                <span className="gacp-diary__count">{filteredEntries.length} mục</span>
            </div>

            {/* ── Filter Chips ────────────────────── */}
            <div className="gacp-diary__filters">
                {GACP_ENTRY_TYPES.map((type) => (
                    <button
                        key={type.id}
                        className={`gacp-diary__filter-chip ${activeFilter === type.id ? 'gacp-diary__filter-chip--active' : ''}`}
                        onClick={() => toggleFilter(type.id)}
                        style={{ '--chip-color': type.color }}
                        title={type.label}
                    >
                        <span className="gacp-diary__filter-icon">{type.icon}</span>
                        <span className="gacp-diary__filter-label">{type.label}</span>
                    </button>
                ))}
            </div>

            {/* ── Content ─────────────────────────── */}
            {viewMode === 'timeline' ? (
                <div className="gacp-diary__timeline">
                    {Object.keys(groupedEntries).length === 0 && (
                        <div className="gacp-diary__empty">
                            <BookOpenCheck size={48} strokeWidth={1} />
                            <p>Chưa có mục nhật ký nào</p>
                            <span>Bấm nút bên dưới để bắt đầu ghi</span>
                        </div>
                    )}
                    {Object.entries(groupedEntries).map(([dateLabel, entries]) => (
                        <div key={dateLabel} className="gacp-diary__date-group">
                            <div className="gacp-diary__date-label">{dateLabel}</div>
                            {entries.map((entry) => (
                                <GACPEntryCard
                                    key={entry.id}
                                    entry={entry}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    users={users}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="gacp-diary__table-wrap">
                    <table className="gacp-diary__table">
                        <thead>
                            <tr>
                                <th>Loại</th>
                                <th>Ngày</th>
                                {activeFilter &&
                                    GACP_TYPE_MAP[activeFilter]?.columnLabels.map((col) => <th key={col}>{col}</th>)}
                                {!activeFilter && (
                                    <>
                                        <th>Tóm tắt</th>
                                        <th>Người</th>
                                    </>
                                )}
                                <th>Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEntries.map((entry) => {
                                const tc = GACP_TYPE_MAP[entry.type];
                                return (
                                    <tr key={entry.id}>
                                        <td>
                                            <span className="gacp-diary__table-badge" style={{ background: tc?.color }}>
                                                {tc?.icon} {tc?.label}
                                            </span>
                                        </td>
                                        <td>{new Date(entry.date).toLocaleDateString('vi-VN')}</td>
                                        {activeFilter &&
                                            tc?.columns.map((col) => <td key={col}>{entry.data[col] || '—'}</td>)}
                                        {!activeFilter && (
                                            <>
                                                <td>
                                                    {Object.values(entry.data).filter(Boolean).slice(0, 2).join(' · ')}
                                                </td>
                                                <td>
                                                    {users?.find((u) => u.id === entry.createdBy)?.name ||
                                                        entry.createdBy}
                                                </td>
                                            </>
                                        )}
                                        <td>{entry.note || '—'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── FAB Button ─────────────────────── */}
            <button className="gacp-diary__fab" onClick={() => setSelectorOpen(true)}>
                <Plus size={22} />
                <span>Ghi nhật ký</span>
            </button>

            {/* ── Type Selector ───────────────────── */}
            <GACPTypeSelector
                isOpen={selectorOpen}
                onClose={() => setSelectorOpen(false)}
                onSelect={handleTypeSelect}
            />

            {/* ── Active Form ─────────────────────── */}
            {ActiveForm && (
                <ActiveForm isOpen={true} onClose={handleFormClose} plotId={currentPlotId} editEntry={editEntry} />
            )}
        </div>
    );
}

export default GACPDiaryPage;
