import React, { useMemo, useCallback } from 'react';
import { Download } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import './ReportPage.scss';

const summaryColumns = [
    { key: 'cycle', label: 'Mùa vụ', sortable: true },
    { key: 'crop', label: 'Cây trồng', hideOnMobile: true },
    { key: 'logCount', label: 'Nhật ký' },
    { key: 'harvestQty', label: 'Sản lượng (kg)', render: (v) => <strong>{v.toLocaleString('vi-VN')}</strong> },
    { key: 'pestCount', label: 'Sâu bệnh' },
    { key: 'status', label: 'Trạng thái' },
];

const ReportPage = () => {
    const { cropCycles, taskLogs, harvestBatches, pestIncidents } = useData();
    const { addToast } = useToast();

    // Chart Data: task logs by status
    const logsByStatus = useMemo(() => {
        const counts = { approved: 0, pending: 0, draft: 0, rejected: 0 };
        taskLogs.forEach((l) => {
            counts[l.status] = (counts[l.status] || 0) + 1;
        });
        return Object.entries(counts).map(([k, v]) => ({ name: k, count: v }));
    }, [taskLogs]);
    const maxLogCount = Math.max(...logsByStatus.map((l) => l.count), 1);

    // Chart Data: harvest by cycle
    const harvestByCycle = useMemo(() => {
        const grouped = {};
        harvestBatches.forEach((h) => {
            const key = h.cycleId || 'Khác';
            grouped[key] = (grouped[key] || 0) + (h.quantityKg || 0);
        });
        return Object.entries(grouped).map(([k, v]) => ({ cycle: k, qty: v }));
    }, [harvestBatches]);
    const maxHarvest = Math.max(...harvestByCycle.map((h) => h.qty), 1);

    // Pest by severity
    const pestBySeverity = useMemo(() => {
        const counts = { low: 0, medium: 0, high: 0, critical: 0 };
        pestIncidents.forEach((p) => {
            counts[p.severity] = (counts[p.severity] || 0) + 1;
        });
        return Object.entries(counts)
            .filter(([, v]) => v > 0)
            .map(([k, v]) => ({ severity: k, count: v }));
    }, [pestIncidents]);
    const totalPest = Math.max(
        pestBySeverity.reduce((s, p) => s + p.count, 0),
        1,
    );

    // Summary table
    const cycleSummary = useMemo(() => {
        return cropCycles.map((c) => {
            const cycleLogs = taskLogs.filter((l) => l.cycleId === c.id);
            const cycleHarvest = harvestBatches.filter((h) => h.cycleId === c.id);
            const cyclePests = pestIncidents.filter((p) => p.cycleId === c.id || p.plotId === c.plotId);
            return {
                id: c.id,
                cycle: c.id,
                crop: c.crop,
                logCount: cycleLogs.length,
                harvestQty: cycleHarvest.reduce((s, h) => s + (h.quantityKg || 0), 0),
                pestCount: cyclePests.length,
                status: c.status,
            };
        });
    }, [cropCycles, taskLogs, harvestBatches, pestIncidents]);

    const handleExport = useCallback(
        (type) => {
            addToast(`Đã tải báo cáo ${type}`, 'success');
        },
        [addToast],
    );

    const statusLabelMap = { approved: 'Đã duyệt', pending: 'Chờ duyệt', draft: 'Nháp', rejected: 'Từ chối' };
    const severityLabelMap = { low: 'Nhẹ', medium: 'T.bình', high: 'Nặng', critical: 'Nghiêm trọng' };

    return (
        <div className="page-container">
            <PageHeader
                title="Báo cáo"
                subtitle="Phân tích sản lượng, nhật ký, sâu bệnh"
                actions={
                    <>
                        <button className="btn btn--outline" onClick={() => handleExport('PDF')}>
                            <Download size={16} /> PDF
                        </button>
                        <button className="btn btn--outline" onClick={() => handleExport('Excel')}>
                            <Download size={16} /> Excel
                        </button>
                    </>
                }
            />

            <div className="report__charts">
                {/* Task Logs by Status */}
                <div className="card">
                    <div className="card__header">
                        <h3 className="font-semibold">Nhật ký theo trạng thái</h3>
                    </div>
                    <div className="card__body">
                        <div className="report__bar-chart">
                            {logsByStatus.map((item) => (
                                <div key={item.name} className="report__bar-row">
                                    <span className="report__bar-label">{statusLabelMap[item.name] || item.name}</span>
                                    <div className="report__bar-track">
                                        <div
                                            className="report__bar-fill"
                                            style={{ width: `${(item.count / maxLogCount) * 100}%` }}
                                        />
                                    </div>
                                    <span className="report__bar-value">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Harvest by Cycle */}
                <div className="card">
                    <div className="card__header">
                        <h3 className="font-semibold">Sản lượng theo mùa vụ (kg)</h3>
                    </div>
                    <div className="card__body">
                        <div className="report__yield-chart">
                            {harvestByCycle.map((d) => (
                                <div key={d.cycle} className="report__yield-group">
                                    <div className="report__yield-bars">
                                        <div
                                            className="report__yield-bar report__yield-bar--actual"
                                            style={{ height: `${(d.qty / maxHarvest) * 100}%` }}
                                        >
                                            {d.qty > 0 && (
                                                <span className="report__yield-bar-label">
                                                    {d.qty.toLocaleString('vi-VN')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className="report__yield-name">{d.cycle}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Pest by Severity */}
            <div className="card">
                <div className="card__header">
                    <h3 className="font-semibold">Sâu bệnh theo mức độ</h3>
                </div>
                <div className="card__body">
                    <div className="report__pest-chart">
                        {pestBySeverity.map((p) => (
                            <div key={p.severity} className="report__pest-item">
                                <span className="report__pest-label">{severityLabelMap[p.severity] || p.severity}</span>
                                <div className="report__pest-bar-track">
                                    <div
                                        className={'report__pest-bar-fill report__pest-bar-fill--' + p.severity}
                                        style={{ width: `${(p.count / totalPest) * 100}%` }}
                                    />
                                </div>
                                <span className="report__pest-count">{p.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Summary Table */}
            <div className="card">
                <div className="card__header">
                    <h3 className="font-semibold">Tổng hợp theo mùa vụ</h3>
                </div>
                <DataTable columns={summaryColumns} data={cycleSummary} pageSize={10} />
            </div>
        </div>
    );
};

export default ReportPage;
