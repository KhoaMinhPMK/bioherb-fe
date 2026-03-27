import React, { useMemo } from 'react';
import {
    MapPin,
    CheckCircle2,
    Users,
    FileCheck,
    AlertTriangle,
    ArrowRight,
    Calendar,
    TrendingUp,
    Sprout,
    ClipboardList,
} from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { ENTITY_STATUS, TASK_LOG_STATUS, PEST_STATUS, SHIFT_LABEL } from '../../constants';
import './Dashboard.scss';

// --- Severity labels for alerts ---
const SEVERITY = {
    warning: { label: 'Lệch nhẹ', className: 'dashboard__severity--warning' },
    error: { label: 'Nghiêm trọng', className: 'dashboard__severity--error' },
    info: { label: 'Thông tin', className: 'dashboard__severity--info' },
};

const Dashboard = () => {
    const { currentFarm, canSeeAllFarms } = useAuth();
    const { plots, taskLogs, attendanceData, taskPlans, cropCycles, pestIncidents, getPlotsByFarm } = useData();

    // --- Compute KPIs from real mock data ---
    const farmPlots = useMemo(() => {
        if (canSeeAllFarms()) return plots;
        if (!currentFarm) return [];
        return getPlotsByFarm(currentFarm.id);
    }, [currentFarm, canSeeAllFarms, plots, getPlotsByFarm]);

    const totalPlots = farmPlots.length;
    const activePlots = farmPlots.filter((p) => p.status === ENTITY_STATUS.ACTIVE).length;
    const activePercent = totalPlots > 0 ? Math.round((activePlots / totalPlots) * 100) : 0;

    // Attendance: % valid workdays (full or approved exception)
    const validAttendance = useMemo(() => {
        const total = attendanceData.length;
        if (total === 0) return 0;
        const valid = attendanceData.filter((a) => a.status === 'full' || (a.exception && a.exception.approved)).length;
        return Math.round((valid / total) * 100);
    }, [attendanceData]);

    // Pending approvals
    const pendingLogs = taskLogs.filter((l) => l.status === TASK_LOG_STATUS.PENDING).length;
    const pendingAttendance = attendanceData.filter((a) => a.exception && a.exception.approved === null).length;
    const totalPending = pendingLogs + pendingAttendance;

    const stats = [
        { label: 'Vùng trồng', value: totalPlots, icon: MapPin, variant: 'info' },
        {
            label: 'VT hoạt động',
            value: `${activePercent}%`,
            icon: CheckCircle2,
            variant: activePercent >= 80 ? 'success' : activePercent >= 50 ? 'warning' : 'error',
        },
        {
            label: 'Ngày công hợp lệ',
            value: `${validAttendance}%`,
            icon: Users,
            variant: validAttendance >= 90 ? 'success' : validAttendance >= 70 ? 'warning' : 'error',
        },
        { label: 'Chờ duyệt', value: totalPending, icon: FileCheck, variant: totalPending > 0 ? 'warning' : 'success' },
    ];

    // --- Alerts with severity badges ---
    const alerts = useMemo(() => {
        const result = [];

        // Check pest incidents still monitoring
        pestIncidents
            .filter((p) => p.status === PEST_STATUS.MONITORING)
            .forEach((p) => {
                result.push({
                    severity: 'error',
                    message: `${p.type} tại ${p.plotName} — mức ${p.severity === 'high' ? 'nặng' : 'trung bình'}, đang theo dõi`,
                    time: p.date,
                });
            });

        // Check plan deviations: tasks done in wrong shift
        taskLogs.forEach((log) => {
            if (!log.planId) return;
            const plan = taskPlans.find((p) => p.id === log.planId);
            if (plan && plan.shift !== log.shift) {
                result.push({
                    severity: 'warning',
                    message: `${log.task} thực hiện buổi ${SHIFT_LABEL[log.shift] || log.shift} (KH: ${SHIFT_LABEL[plan.shift] || plan.shift})`,
                    time: log.date,
                });
            }
        });

        // Pending logs need approval
        if (pendingLogs > 0) {
            result.push({
                severity: 'info',
                message: `${pendingLogs} nhật ký đang chờ duyệt`,
                time: 'Hôm nay',
            });
        }

        return result;
    }, [pendingLogs, pestIncidents, taskLogs, taskPlans]);

    // --- Today's tasks from plan ---
    const todayTasks = useMemo(() => {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        const todayStr = `${dd}/${mm}/${yyyy}`;

        return taskPlans
            .filter((p) => p.date === todayStr || p.date === '22/03/2026') // fallback for demo
            .map((plan) => {
                const plot = plots.find((p) => p.id === plan.plotId);
                const log = taskLogs.find((l) => l.planId === plan.id);
                return {
                    id: plan.id,
                    shift: plan.shift,
                    task: `${plan.task} — ${plot?.name || plan.plotId}`,
                    status: log ? log.status : 'planned',
                    isPlanned: true,
                };
            });
    }, [taskPlans, plots, taskLogs]);

    // Unplanned tasks (no planId)
    const unplannedRecent = taskLogs
        .filter((l) => !l.planId && l.status === 'pending')
        .slice(0, 3)
        .map((l) => ({
            id: `unplanned-${l.id}`,
            shift: l.shift,
            task: `${l.task} — ${l.workerName}`,
            status: 'pending',
            isPlanned: false,
        }));

    const allTodayTasks = [...todayTasks, ...unplannedRecent];

    // --- Upcoming from plans ---
    const upcomingTasks = taskPlans.slice(2, 6).map((plan) => {
        const plot = plots.find((p) => p.id === plan.plotId);
        return { date: plan.date.slice(0, 5), task: plan.task, plot: plot?.name || '' };
    });

    const shiftLabelMap = SHIFT_LABEL;

    // --- Recent approved logs ---
    const recentLogs = taskLogs
        .filter((l) => l.status === TASK_LOG_STATUS.APPROVED)
        .slice(0, 3)
        .map((l) => ({
            date: l.date.slice(0, 5),
            task: l.task,
            user: l.workerName,
            status: l.status,
        }));

    return (
        <div className="dashboard page-container">
            <PageHeader title="Dashboard" subtitle="Tổng quan hoạt động sản xuất" />

            {/* KPI Row */}
            <div className="dashboard__stats">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className={`dashboard__stat dashboard__stat--${stat.variant}`}>
                            <div className="dashboard__stat-icon">
                                <Icon size={20} aria-hidden="true" />
                            </div>
                            <div className="dashboard__stat-info">
                                <span className="dashboard__stat-value">{stat.value}</span>
                                <span className="dashboard__stat-label">{stat.label}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main Row */}
            <div className="dashboard__main">
                {/* FOCAL: Việc hôm nay */}
                <div className="card dashboard__focal">
                    <div className="card__header">
                        <h2 className="dashboard__section-title">
                            <Calendar size={18} aria-hidden="true" />
                            Việc hôm nay
                            <span className="dashboard__count">{allTodayTasks.length}</span>
                        </h2>
                        <a href="/task-plans" className="dashboard__view-all">
                            Xem kế hoạch <ArrowRight size={14} />
                        </a>
                    </div>
                    <div className="dashboard__task-list">
                        {allTodayTasks.map((task) => (
                            <div key={task.id} className="dashboard__task-item">
                                <div className="dashboard__task-shift">{shiftLabelMap[task.shift] || '—'}</div>
                                <div className="dashboard__task-info">
                                    <span className="dashboard__task-name">{task.task}</span>
                                    {task.isPlanned ? (
                                        <span className="dashboard__badge dashboard__badge--planned">Theo KH</span>
                                    ) : (
                                        <span className="dashboard__badge dashboard__badge--unplanned">Phát sinh</span>
                                    )}
                                </div>
                                <StatusBadge status={task.status} />
                            </div>
                        ))}
                        {allTodayTasks.length === 0 && (
                            <p className="dashboard__empty-msg">Không có công việc hôm nay</p>
                        )}
                    </div>
                </div>

                {/* Right sidebar */}
                <div className="dashboard__sidebar">
                    {/* Alerts with severity */}
                    <div className="card">
                        <div className="card__header">
                            <h3 className="dashboard__section-title dashboard__section-title--sm">
                                <AlertTriangle size={16} aria-hidden="true" />
                                Cảnh báo
                            </h3>
                        </div>
                        <div className="dashboard__alerts">
                            {alerts.map((alert) => (
                                <div
                                    key={`alert-${alert.severity}-${alert.message.slice(0, 20)}`}
                                    className={`dashboard__alert dashboard__alert--${alert.severity}`}
                                >
                                    <div className="dashboard__alert-top">
                                        <div className="dashboard__alert-dot" />
                                        <span
                                            className={`dashboard__severity ${SEVERITY[alert.severity]?.className || ''}`}
                                        >
                                            {SEVERITY[alert.severity]?.label}
                                        </span>
                                    </div>
                                    <p className="dashboard__alert-msg">{alert.message}</p>
                                    <span className="dashboard__alert-time">{alert.time}</span>
                                </div>
                            ))}
                            {alerts.length === 0 && <p className="dashboard__empty-msg">Không có cảnh báo</p>}
                        </div>
                    </div>

                    {/* Upcoming */}
                    <div className="card">
                        <div className="card__header">
                            <h3 className="dashboard__section-title dashboard__section-title--sm">
                                <TrendingUp size={16} aria-hidden="true" />
                                Sắp tới
                            </h3>
                        </div>
                        <div className="dashboard__upcoming">
                            {upcomingTasks.map((task) => (
                                <div key={`upcoming-${task.date}-${task.task}`} className="dashboard__upcoming-item">
                                    <span className="dashboard__upcoming-date">{task.date}</span>
                                    <div className="dashboard__upcoming-info">
                                        <span className="dashboard__upcoming-task">{task.task}</span>
                                        <span className="dashboard__upcoming-plot">{task.plot}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom: Recent Logs + Plot Status */}
            <div className="dashboard__bottom">
                {/* Recent logs */}
                <div className="card">
                    <div className="card__header">
                        <h3 className="dashboard__section-title dashboard__section-title--sm">
                            <ClipboardList size={16} aria-hidden="true" />
                            Nhật ký gần đây
                        </h3>
                        <a href="/task-logs" className="dashboard__view-all">
                            Xem tất cả <ArrowRight size={14} />
                        </a>
                    </div>
                    <div className="dashboard__recent-logs">
                        {recentLogs.map((log) => (
                            <div key={`log-${log.date}-${log.task}`} className="dashboard__log-item">
                                <span className="dashboard__log-date">{log.date}</span>
                                <span className="dashboard__log-task">{log.task}</span>
                                <span className="dashboard__log-user">{log.user}</span>
                                <StatusBadge status={log.status} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Plot status overview */}
                <div className="card">
                    <div className="card__header">
                        <h3 className="dashboard__section-title dashboard__section-title--sm">
                            <Sprout size={16} aria-hidden="true" />
                            Trạng thái vùng trồng
                        </h3>
                        <a href="/plots" className="dashboard__view-all">
                            Xem tất cả <ArrowRight size={14} />
                        </a>
                    </div>
                    <div className="dashboard__plot-status">
                        {farmPlots.slice(0, 5).map((plot) => {
                            const cycle = cropCycles.find((c) => c.id === plot.activeCycle);
                            return (
                                <div key={plot.id} className="dashboard__plot-item">
                                    <div className="dashboard__plot-info">
                                        <span className="dashboard__plot-name">{plot.name}</span>
                                        <span className="dashboard__plot-crop">{plot.crop}</span>
                                    </div>
                                    {cycle ? (
                                        <div className="dashboard__plot-progress">
                                            <div className="dashboard__plot-bar-track">
                                                <div
                                                    className="dashboard__plot-bar-fill"
                                                    style={{ width: `${cycle.progress}%` }}
                                                />
                                            </div>
                                            <span className="dashboard__plot-percent">{cycle.progress}%</span>
                                        </div>
                                    ) : (
                                        <StatusBadge status="idle" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
