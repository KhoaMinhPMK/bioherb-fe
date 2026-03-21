import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Send, CheckCircle2, Clock } from 'lucide-react';
import StatusBadge from '../StatusBadge';
import './TimesheetView.scss';
const DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
function getMonday(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
}
function formatDate(d) {
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function formatWeekRange(monday) {
    const sun = new Date(monday);
    sun.setDate(sun.getDate() + 6);
    return `${formatDate(monday)} — ${formatDate(sun)}`;
}
const TimesheetView = ({ logs = [], weekStatus = 'draft', onSubmit }) => {
    const [weekOffset, setWeekOffset] = useState(0);
    const monday = useMemo(() => {
        const m = getMonday(new Date());
        m.setDate(m.getDate() + weekOffset * 7);
        m.setHours(0, 0, 0, 0);
        return m;
    }, [weekOffset]);
    const weekDates = useMemo(() => {
        return DAYS.map((_, i) => {
            const d = new Date(monday);
            d.setDate(d.getDate() + i);
            return d;
        });
    }, [monday]);
    const parseDate = (str) => {
        const [d, m, y] = str.split('/').map(Number);
        return new Date(y, m - 1, d);
    };
    const weekLogs = useMemo(() => {
        const sunday = new Date(monday);
        sunday.setDate(sunday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);
        return logs.filter((l) => {
            const d = parseDate(l.date);
            return d >= monday && d <= sunday;
        });
    }, [logs, monday]);
    const tasks = useMemo(() => {
        const map = {};
        weekLogs.forEach((l) => {
            if (!map[l.task])
                map[l.task] = { task: l.task, days: Array(7).fill(0), total: 0 };
            const d = parseDate(l.date);
            const dayIndex = (d.getDay() + 6) % 7;
            map[l.task].days[dayIndex] += l.hours || 0;
            map[l.task].total += l.hours || 0;
        });
        return Object.values(map);
    }, [weekLogs]);
    const dayTotals = useMemo(() => {
        const totals = Array(7).fill(0);
        tasks.forEach((t) => t.days.forEach((h, i) => { totals[i] += h; }));
        return totals;
    }, [tasks]);
    const grandTotal = dayTotals.reduce((a, b) => a + b, 0);
    return (<div className="timesheet">
            <div className="timesheet__header">
                <button className="btn btn--ghost timesheet__nav-btn" onClick={() => setWeekOffset((o) => o - 1)} aria-label="Tuần trước">
                    <ChevronLeft size={18}/>
                </button>
                <div className="timesheet__week-label">
                    <span>Tuần: {formatWeekRange(monday)}</span>
                    <StatusBadge status={weekStatus}/>
                </div>
                <button className="btn btn--ghost timesheet__nav-btn" onClick={() => setWeekOffset((o) => o + 1)} aria-label="Tuần sau">
                    <ChevronRight size={18}/>
                </button>
            </div>

            <div className="timesheet__scroll">
                <table className="timesheet__table">
                    <thead>
                        <tr>
                            <th className="timesheet__task-col">Công việc</th>
                            {DAYS.map((day, i) => (<th key={day} className="timesheet__day-col">
                                    <div className="timesheet__day-name">{day}</div>
                                    <div className="timesheet__day-date">{formatDate(weekDates[i])}</div>
                                </th>))}
                            <th className="timesheet__total-col">Tổng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.length === 0 && (<tr>
                                <td colSpan={9} className="timesheet__empty">
                                    <Clock size={20}/>
                                    <span>Chưa có nhật ký trong tuần này</span>
                                </td>
                            </tr>)}
                        {tasks.map((t) => (<tr key={t.task}>
                                <td className="timesheet__task-name">{t.task}</td>
                                {t.days.map((h, i) => (<td key={i} className={`timesheet__cell ${h > 0 ? 'timesheet__cell--filled' : ''}`}>
                                        {h > 0 ? `${h}h` : '—'}
                                    </td>))}
                                <td className="timesheet__row-total">{t.total}h</td>
                            </tr>))}
                    </tbody>
                    <tfoot>
                        <tr className="timesheet__footer-row">
                            <td className="timesheet__footer-label">Tổng ngày</td>
                            {dayTotals.map((h, i) => (<td key={i} className={`timesheet__footer-cell ${h > 0 ? 'timesheet__footer-cell--has' : ''}`}>
                                    {h > 0 ? `${h}h` : '0'}
                                </td>))}
                            <td className="timesheet__grand-total">{grandTotal}h</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {weekStatus === 'draft' && tasks.length > 0 && (<div className="timesheet__actions">
                    <button className="btn btn--primary" onClick={onSubmit}>
                        <Send size={16}/> Nộp nhật ký tuần
                    </button>
                </div>)}
            {weekStatus === 'submitted' && (<div className="timesheet__status-msg timesheet__status-msg--submitted">
                    <Clock size={16}/> Đã nộp — đang chờ duyệt
                </div>)}
            {weekStatus === 'approved' && (<div className="timesheet__status-msg timesheet__status-msg--approved">
                    <CheckCircle2 size={16}/> Đã duyệt
                </div>)}
        </div>);
};
export default TimesheetView;
