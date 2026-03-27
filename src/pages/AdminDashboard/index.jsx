import React, { useMemo } from 'react';
import {
    Building2,
    Tractor,
    MapPin,
    BookCheck,
    FileClock,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    Users,
} from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import { useData } from '../../contexts/DataContext';
import './AdminDashboard.scss';

const AdminDashboard = () => {
    const { cooperatives, farms, plots, attendanceData, taskLogs } = useData();
    // System-level KPIs
    const stats = useMemo(() => {
        const htxCount = cooperatives.length;
        const farmCount = farms.length;
        const plotCount = plots.length;
        const plotsWithWarning = plots.filter((p) => p.status === 'pest_alert' || p.status === 'inactive').length;

        // Journal completion: % of approved logs / total
        const totalLogs = taskLogs.length;
        const approvedLogs = taskLogs.filter((l) => l.status === 'approved').length;
        const journalCompletion = totalLogs > 0 ? Math.round((approvedLogs / totalLogs) * 100) : 0;

        // Pending data: not-approved logs + pending attendance exceptions
        const pendingLogs = taskLogs.filter((l) => l.status === 'pending' || l.status === 'draft').length;
        const pendingAttendance = attendanceData.filter((a) => a.exception?.approved === null).length;

        return {
            htxCount,
            farmCount,
            plotCount,
            plotsWithWarning,
            journalCompletion,
            pendingLogs,
            pendingAttendance,
            totalPending: pendingLogs + pendingAttendance,
        };
    }, [cooperatives, farms, plots, taskLogs, attendanceData]);

    // HTX table data
    const htxTableData = useMemo(() => {
        return cooperatives.map((htx) => {
            const htxFarms = farms.filter((f) => f.cooperativeId === htx.id);
            const htxPlots = plots.filter((p) => htxFarms.some((f) => f.id === p.farmId));
            const activePlots = htxPlots.filter((p) => p.status === 'active').length;
            return {
                ...htx,
                farmCount: htxFarms.length,
                plotCount: htxPlots.length,
                activePlots,
                completionRate: htxPlots.length > 0 ? Math.round((activePlots / htxPlots.length) * 100) : 0,
            };
        });
    }, [cooperatives, farms, plots]);

    const kpiCards = [
        {
            icon: Building2,
            label: 'HTX hoạt động',
            value: stats.htxCount,
            variant: 'info',
        },
        {
            icon: Tractor,
            label: 'Farm đang sản xuất',
            value: stats.farmCount,
            variant: 'success',
        },
        {
            icon: MapPin,
            label: 'VT cảnh báo',
            value: stats.plotsWithWarning,
            variant: stats.plotsWithWarning > 0 ? 'warning' : 'success',
        },
        {
            icon: BookCheck,
            label: '% hoàn thành nhật ký',
            value: `${stats.journalCompletion}%`,
            variant: stats.journalCompletion >= 80 ? 'success' : 'warning',
        },
        {
            icon: FileClock,
            label: 'Dữ liệu chờ duyệt',
            value: stats.totalPending,
            variant: stats.totalPending > 0 ? 'warning' : 'neutral',
        },
    ];

    return (
        <div className="page-container">
            <PageHeader
                title="Dashboard Giám Sát Hệ Thống"
                subtitle="Tổng quan toàn bộ hợp tác xã — cấp Sankit Admin"
            />

            {/* KPI Cards */}
            <div className="admin-kpi-grid">
                {kpiCards.map((kpi) => (
                    <div key={kpi.label} className={`admin-kpi-card admin-kpi-card--${kpi.variant}`}>
                        <div className="admin-kpi-card__icon">
                            <kpi.icon size={24} />
                        </div>
                        <div className="admin-kpi-card__body">
                            <span className="admin-kpi-card__value">{kpi.value}</span>
                            <span className="admin-kpi-card__label">{kpi.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* HTX Table */}
            <div className="card admin-htx-table">
                <div className="card__header">
                    <h3 className="admin-htx-table__title">
                        <Building2 size={18} /> Danh sách Hợp tác xã
                    </h3>
                </div>
                <div className="admin-htx-table__scroll">
                    <table className="admin-htx-table__table">
                        <thead>
                            <tr>
                                <th>Hợp tác xã</th>
                                <th>Số Farm</th>
                                <th>Vùng trồng</th>
                                <th>% VT hoạt động</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {htxTableData.map((htx) => (
                                <tr key={htx.id}>
                                    <td>
                                        <strong>{htx.name}</strong>
                                    </td>
                                    <td className="admin-htx-table__center">{htx.farmCount}</td>
                                    <td className="admin-htx-table__center">{htx.plotCount}</td>
                                    <td className="admin-htx-table__center">
                                        <div className="admin-htx-table__progress">
                                            <div
                                                className="admin-htx-table__progress-bar"
                                                style={{ width: `${htx.completionRate}%` }}
                                            />
                                            <span>{htx.completionRate}%</span>
                                        </div>
                                    </td>
                                    <td>
                                        <StatusBadge
                                            status={htx.completionRate >= 80 ? 'active' : 'warning'}
                                            label={htx.completionRate >= 80 ? 'Tốt' : 'Chú ý'}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="admin-quick-stats card">
                <div className="card__header">
                    <h3>
                        <TrendingUp size={18} /> Thống kê nhanh
                    </h3>
                </div>
                <div className="admin-quick-stats__grid">
                    <div className="admin-quick-stats__item">
                        <Users size={16} />
                        <span>{stats.plotCount} vùng trồng tổng</span>
                    </div>
                    <div className="admin-quick-stats__item">
                        <CheckCircle2 size={16} />
                        <span>{stats.journalCompletion}% nhật ký đã duyệt</span>
                    </div>
                    <div className="admin-quick-stats__item">
                        <AlertTriangle size={16} />
                        <span>{stats.plotsWithWarning} VT cần chú ý</span>
                    </div>
                    <div className="admin-quick-stats__item">
                        <FileClock size={16} />
                        <span>
                            {stats.pendingLogs} nhật ký + {stats.pendingAttendance} chấm công chờ duyệt
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
