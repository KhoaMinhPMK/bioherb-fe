import React, { useState, useMemo, useCallback } from 'react';
import { FileDown } from 'lucide-react';
import { GACP_ENTRY_TYPES, GACP_PHASES } from './gacpConstants';
import GACPIconMap from './gacpIcons';
import GACPSpreadsheet from './components/GACPSpreadsheet';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { exportGacpPdf } from './gacpPdfExport';
import './GACPDiaryView.scss';

/**
 * GACPDiaryView — "Quyển Sổ" Layout
 *
 * Layout: [Vertical Tabs (left)] + [Full-Width Spreadsheet (right)]
 * - Tabs grouped by cultivation phase
 * - Active type highlighted, spreadsheet fills remaining space
 * - Compact footer with count + PDF export
 */
function GACPDiaryView() {
    const { gacpEntries, farms, cooperatives } = useData();
    const { currentUser } = useAuth();
    const { addToast } = useToast();

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

    const [selectedType, setSelectedType] = useState(GACP_ENTRY_TYPES[0].id);

    // ─── Count entries per type ─────────────────
    const countByType = useMemo(() => {
        const counts = {};
        GACP_ENTRY_TYPES.forEach((t) => {
            counts[t.id] = 0;
        });
        gacpEntries.forEach((e) => {
            if (counts[e.type] !== undefined) counts[e.type]++;
        });
        return counts;
    }, [gacpEntries]);

    const totalToday = useMemo(() => {
        const todayStr = new Date().toISOString().slice(0, 10);
        return gacpEntries.filter((e) => e.date === todayStr).length;
    }, [gacpEntries]);

    // ─── Export PDF ─────────────────────────────
    const handleExportPdf = useCallback(async () => {
        try {
            addToast('Đang tạo PDF...', 'info');
            const fileName = await exportGacpPdf(gacpCoverData, gacpEntries, {});
            addToast(`Đã xuất ${fileName}`, 'success');
        } catch (err) {
            addToast('Lỗi xuất PDF: ' + err.message, 'error');
        }
    }, [gacpEntries, gacpCoverData, addToast]);

    return (
        <div className="gacp-notebook">
            {/* ── Left: Vertical Tabs ──────────── */}
            <nav className="gacp-notebook__tabs">
                {GACP_PHASES.map((phase) => {
                    const PhaseIcon = GACPIconMap[phase.iconName];
                    const phaseTypes = GACP_ENTRY_TYPES.filter((t) => phase.groups.includes(t.group));
                    return (
                        <div key={phase.id} className="gacp-notebook__phase">
                            <div className="gacp-notebook__phase-header">
                                {PhaseIcon && <PhaseIcon size={13} />}
                                <span>{phase.label}</span>
                            </div>
                            {phaseTypes.map((type) => {
                                const Icon = GACPIconMap[type.iconName];
                                const isActive = selectedType === type.id;
                                const count = countByType[type.id] || 0;
                                return (
                                    <button
                                        key={type.id}
                                        className={`gacp-notebook__tab ${isActive ? 'gacp-notebook__tab--active' : ''}`}
                                        onClick={() => setSelectedType(type.id)}
                                        style={isActive ? { borderLeftColor: type.color } : {}}
                                    >
                                        <span
                                            className="gacp-notebook__tab-icon"
                                            style={{ color: isActive ? type.color : undefined }}
                                        >
                                            {Icon && <Icon size={15} />}
                                        </span>
                                        <span className="gacp-notebook__tab-label">{type.label}</span>
                                        {count > 0 && <span className="gacp-notebook__tab-count">{count}</span>}
                                    </button>
                                );
                            })}
                        </div>
                    );
                })}
            </nav>

            {/* ── Right: Spreadsheet + Footer ──── */}
            <div className="gacp-notebook__workspace">
                <GACPSpreadsheet selectedType={selectedType} />

                {/* Compact footer */}
                <div className="gacp-notebook__footer">
                    <span className="gacp-notebook__footer-stat">
                        Tổng: <strong>{gacpEntries.length}</strong>
                    </span>
                    <span className="gacp-notebook__footer-stat">
                        Hôm nay: <strong>{totalToday}</strong>
                    </span>
                    <button className="btn btn--outline btn--sm" onClick={handleExportPdf}>
                        <FileDown size={14} /> Xuất PDF
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GACPDiaryView;
