import React, { useState, useMemo, useCallback } from 'react';
import { Plus, CalendarDays, ChevronLeft, ChevronRight, AlertTriangle, Clock, MapPin, Save, X } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import PlanActualBadge from '../../components/PlanActualBadge';
import Modal from '../../components/Modal';
import { useToast } from '../../contexts/ToastContext';
import { useData } from '../../contexts/DataContext';
import './TaskPlan.scss';

const SHIFT_LABELS = { morning: 'Sáng', afternoon: 'Trưa', evening: 'Chiều' };
const SHIFT_KEYS = ['morning', 'afternoon', 'evening'];

function formatDateVN(d) {
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function formatDateShort(d) {
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function getMonday(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
}

function parseDateVN(str) {
    const [d, m, y] = str.split('/').map(Number);
    return new Date(y, m - 1, d);
}

// Compute deviations by comparing logs vs plans
function computeDeviations(plans, logs) {
    const deviations = [];

    // Check each plan: is there a matching log?
    plans.forEach((plan) => {
        const matchingLogs = logs.filter((log) => log.planId === plan.id);
        if (matchingLogs.length === 0) {
            // Plan not yet executed — check if it's in the past
            const planDate = parseDateVN(plan.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const diffDays = Math.round((today - planDate) / (1000 * 60 * 60 * 24));
            if (diffDays > 0) {
                deviations.push({
                    id: `dev-${plan.id}`,
                    type: diffDays >= 3 ? 'major' : 'minor',
                    planId: plan.id,
                    message:
                        diffDays >= 3
                            ? `🔴 "${plan.task}" trễ ${diffDays} ngày so với KH (${plan.date})`
                            : `🟡 "${plan.task}" chưa thực hiện (KH: ${plan.date})`,
                    plotId: plan.plotId,
                });
            }
        } else {
            // Executed but check shift deviation
            matchingLogs.forEach((log) => {
                if (log.shift !== plan.shift) {
                    deviations.push({
                        id: `dev-${plan.id}-shift`,
                        type: 'shift',
                        planId: plan.id,
                        message: `🟡 "${plan.task}" thực hiện buổi ${SHIFT_LABELS[log.shift]} (KH: ${SHIFT_LABELS[plan.shift]})`,
                        plotId: plan.plotId,
                    });
                }
            });
        }
    });

    // Check unplanned tasks (logs without planId)
    logs.filter((log) => !log.planId).forEach((log) => {
        deviations.push({
            id: `dev-unplanned-${log.id}`,
            type: 'unplanned',
            message: `⚡ "${log.task}" phát sinh (chưa có trong KH)`,
            plotId: log.plotId,
        });
    });

    return deviations;
}

const TaskPlanList = () => {
    const { addToast } = useToast();
    const { taskPlans, taskLogs, plots, addTaskPlan, isLoading } = useData();
    const [weekOffset, setWeekOffset] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [planForm, setPlanForm] = useState({
        task: '',
        date: '',
        shift: 'morning',
        plotId: '',
        assignee: '',
        status: 'planned',
    });

    // Compute the week range
    const monday = useMemo(() => {
        const m = getMonday(new Date());
        m.setDate(m.getDate() + weekOffset * 7);
        m.setHours(0, 0, 0, 0);
        return m;
    }, [weekOffset]);

    const weekDates = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(monday);
            d.setDate(d.getDate() + i);
            return d;
        });
    }, [monday]);

    const weekRange = `${formatDateShort(weekDates[0])} — ${formatDateShort(weekDates[6])}`;

    // Filter plans for this week
    const weekPlans = useMemo(() => {
        const sunday = new Date(weekDates[6]);
        sunday.setHours(23, 59, 59, 999);
        return taskPlans.filter((p) => {
            const d = parseDateVN(p.date);
            return d >= monday && d <= sunday;
        });
    }, [monday, weekDates, taskPlans]);

    // Filter logs for this week
    const weekLogs = useMemo(() => {
        const sunday = new Date(weekDates[6]);
        sunday.setHours(23, 59, 59, 999);
        return taskLogs.filter((l) => {
            const d = parseDateVN(l.date);
            return d >= monday && d <= sunday;
        });
    }, [monday, weekDates, taskLogs]);

    // Deviation alerts
    const deviations = useMemo(() => computeDeviations(weekPlans, weekLogs), [weekPlans, weekLogs]);

    // Build timeline matrix: date → shift → tasks[]
    const timeline = useMemo(() => {
        return weekDates.map((dateObj) => {
            const dateStr = formatDateVN(dateObj);
            const dayPlans = weekPlans.filter((p) => p.date === dateStr);
            const dayLogs = weekLogs.filter((l) => l.date === dateStr);

            const shifts = {};
            SHIFT_KEYS.forEach((shiftKey) => {
                const planned = dayPlans.filter((p) => p.shift === shiftKey);
                const actual = dayLogs.filter((l) => l.shift === shiftKey);
                shifts[shiftKey] = { planned, actual };
            });

            return { dateObj, dateStr, shifts };
        });
    }, [weekDates, weekPlans, weekLogs]);

    const dayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

    const handleAddPlan = useCallback(async () => {
        if (!planForm.task.trim() || !planForm.date || !planForm.plotId) {
            addToast('Vui lòng nhập đủ thông tin', 'error');
            return;
        }
        const newId = `TP${String(taskPlans.length + 1).padStart(2, '0')}`;
        await addTaskPlan({ id: newId, ...planForm });
        addToast(`Đã thêm kế hoạch "${planForm.task}"`, 'success');
        setModalOpen(false);
        setPlanForm({ task: '', date: '', shift: 'morning', plotId: '', assignee: '', status: 'planned' });
    }, [planForm, taskPlans.length, addTaskPlan, addToast]);

    return (
        <div className="page-container">
            <PageHeader
                title="Kế hoạch sản xuất"
                subtitle="Timeline công việc theo buổi — đối chiếu thực hiện"
                actions={
                    <button className="btn btn--primary" onClick={() => setModalOpen(true)}>
                        <Plus size={16} /> Thêm kế hoạch
                    </button>
                }
            />

            {/* Deviation Alerts */}
            {deviations.length > 0 && (
                <div className="plan-alerts card">
                    <h3 className="plan-alerts__title">
                        <AlertTriangle size={16} /> Cảnh báo lệch kế hoạch ({deviations.length})
                    </h3>
                    <div className="plan-alerts__list">
                        {deviations.map((dev) => (
                            <div
                                key={dev.id}
                                className={`plan-alerts__item plan-alerts__item--${dev.type === 'major' ? 'major' : dev.type === 'unplanned' ? 'unplanned' : 'minor'}`}
                            >
                                <span className="plan-alerts__message">{dev.message}</span>
                                {dev.plotId && (
                                    <span className="plan-alerts__plot">
                                        <MapPin size={12} /> {dev.plotId}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Week Navigator */}
            <div className="plan-timeline card">
                <div className="plan-timeline__header">
                    <button className="btn btn--ghost" onClick={() => setWeekOffset((o) => o - 1)}>
                        <ChevronLeft size={18} />
                    </button>
                    <div className="plan-timeline__week-label">
                        <CalendarDays size={16} />
                        <span>Tuần: {weekRange}</span>
                        <span className="plan-timeline__count">
                            {weekPlans.length} KH · {weekLogs.length} thực tế
                        </span>
                    </div>
                    <button className="btn btn--ghost" onClick={() => setWeekOffset((o) => o + 1)}>
                        <ChevronRight size={18} />
                    </button>
                </div>

                {/* Timeline Grid */}
                <div className="plan-timeline__scroll">
                    <table className="plan-timeline__table">
                        <thead>
                            <tr>
                                <th className="plan-timeline__date-col">Ngày</th>
                                <th className="plan-timeline__shift-col">Sáng</th>
                                <th className="plan-timeline__shift-col">Trưa</th>
                                <th className="plan-timeline__shift-col">Chiều</th>
                            </tr>
                        </thead>
                        <tbody>
                            {timeline.map((day, i) => {
                                const isToday = day.dateStr === formatDateVN(new Date());
                                return (
                                    <tr key={day.dateStr} className={isToday ? 'plan-timeline__row--today' : ''}>
                                        <td className="plan-timeline__date-cell">
                                            <span className="plan-timeline__day-name">{dayLabels[i]}</span>
                                            <span className="plan-timeline__day-num">
                                                {formatDateShort(day.dateObj)}
                                            </span>
                                            {isToday && <span className="plan-timeline__today-dot" />}
                                        </td>
                                        {SHIFT_KEYS.map((shiftKey) => {
                                            const { planned, actual } = day.shifts[shiftKey];
                                            const hasContent = planned.length > 0 || actual.length > 0;
                                            return (
                                                <td
                                                    key={shiftKey}
                                                    className={`plan-timeline__cell ${hasContent ? 'plan-timeline__cell--has' : ''}`}
                                                >
                                                    {planned.map((p) => {
                                                        const executed = actual.find((l) => l.planId === p.id);
                                                        return (
                                                            <div
                                                                key={p.id}
                                                                className={`plan-timeline__task ${executed ? 'plan-timeline__task--done' : 'plan-timeline__task--pending'}`}
                                                            >
                                                                <span className="plan-timeline__task-name">
                                                                    {p.task}
                                                                </span>
                                                                <span className="plan-timeline__task-plot">
                                                                    {p.plotId}
                                                                </span>
                                                                {executed ? (
                                                                    <PlanActualBadge type="planned" />
                                                                ) : (
                                                                    <span className="plan-timeline__task-pending-label">
                                                                        <Clock size={10} /> Chờ
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                    {actual
                                                        .filter((l) => !l.planId)
                                                        .map((l) => (
                                                            <div
                                                                key={l.id}
                                                                className="plan-timeline__task plan-timeline__task--unplanned"
                                                            >
                                                                <span className="plan-timeline__task-name">
                                                                    {l.task}
                                                                </span>
                                                                <span className="plan-timeline__task-plot">
                                                                    {l.plotId}
                                                                </span>
                                                                <PlanActualBadge type="unplanned" />
                                                            </div>
                                                        ))}
                                                    {!hasContent && (
                                                        <span className="plan-timeline__empty-cell">—</span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Plan Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Thêm kế hoạch mới"
                footer={
                    <div className="modal-actions">
                        <button className="btn btn--outline" onClick={() => setModalOpen(false)}>
                            <X size={16} /> Hủy
                        </button>
                        <button className="btn btn--primary" onClick={handleAddPlan} disabled={isLoading}>
                            <Save size={16} /> Thêm
                        </button>
                    </div>
                }
            >
                <div className="form-fields">
                    <div className="form-field">
                        <label className="form-field__label">Công việc *</label>
                        <input
                            className="form-field__input"
                            value={planForm.task}
                            onChange={(e) => setPlanForm((p) => ({ ...p, task: e.target.value }))}
                            placeholder="VD: Bón phân, Phun thuốc..."
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Ngày *</label>
                        <input
                            className="form-field__input"
                            value={planForm.date}
                            onChange={(e) => setPlanForm((p) => ({ ...p, date: e.target.value }))}
                            placeholder="DD/MM/YYYY"
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Buổi</label>
                        <select
                            className="form-field__input"
                            value={planForm.shift}
                            onChange={(e) => setPlanForm((p) => ({ ...p, shift: e.target.value }))}
                        >
                            <option value="morning">Sáng</option>
                            <option value="afternoon">Trưa</option>
                            <option value="evening">Chiều</option>
                        </select>
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Vùng trồng *</label>
                        <select
                            className="form-field__input"
                            value={planForm.plotId}
                            onChange={(e) => setPlanForm((p) => ({ ...p, plotId: e.target.value }))}
                        >
                            <option value="">-- Chọn --</option>
                            {plots.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name} ({p.id})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Người thực hiện</label>
                        <input
                            className="form-field__input"
                            value={planForm.assignee}
                            onChange={(e) => setPlanForm((p) => ({ ...p, assignee: e.target.value }))}
                            placeholder="Tên người thực hiện"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default TaskPlanList;
