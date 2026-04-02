import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, AlertTriangle, XCircle, CheckCheck } from 'lucide-react';
import StatusBadge from '../StatusBadge';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import './TimesheetView.scss';

const STATUS_MAP = {
    full: { label: 'Đủ công', badge: 'active', icon: CheckCircle2 },
    partial: { label: 'Thiếu công', badge: 'warning', icon: AlertTriangle },
    exception: { label: 'Rời sớm', badge: 'error', icon: AlertTriangle },
};

function formatDateVN(d) {
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

const TimesheetView = ({ onApproveException }) => {
    const { currentFarm } = useAuth();
    const { attendanceData } = useData();
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Navigate days
    const prevDay = () => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() - 1);
        setSelectedDate(d);
    };
    const nextDay = () => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + 1);
        setSelectedDate(d);
    };

    const dateStr = formatDateVN(selectedDate);

    // Get attendance for current farm + date
    const dayRecords = useMemo(() => {
        const farmId = currentFarm?.id;
        if (!farmId) return [];
        return attendanceData.filter((a) => a.farmId === String(farmId) && a.date === dateStr);
    }, [currentFarm, attendanceData, dateStr]);

    // Summary stats
    const stats = useMemo(() => {
        const total = dayRecords.length;
        const full = dayRecords.filter((r) => r.status === 'full').length;
        const exceptions = dayRecords.filter((r) => r.status === 'exception').length;
        const pendingApproval = dayRecords.filter((r) => r.exception?.approved === null).length;
        return { total, full, exceptions, pendingApproval };
    }, [dayRecords]);

    return (
        <div className="timesheet">
            {/* Date Navigator */}
            <div className="timesheet__header">
                <button className="btn btn--ghost timesheet__nav-btn" onClick={prevDay} aria-label="Ngày trước">
                    <ChevronLeft size={18} />
                </button>
                <div className="timesheet__week-label">
                    <span className="timesheet__date-main">{dateStr}</span>
                    <span className="timesheet__date-sub">
                        {stats.total} người · {stats.full} đủ công ·{' '}
                        {stats.exceptions > 0 && (
                            <span className="timesheet__exception-count">{stats.exceptions} ngoại lệ</span>
                        )}
                        {stats.pendingApproval > 0 && (
                            <span className="timesheet__pending-count"> · {stats.pendingApproval} chờ duyệt</span>
                        )}
                    </span>
                </div>
                <button className="btn btn--ghost timesheet__nav-btn" onClick={nextDay} aria-label="Ngày sau">
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* Attendance Table */}
            <div className="timesheet__scroll">
                <table className="timesheet__table">
                    <thead>
                        <tr>
                            <th className="timesheet__name-col">Nhân công</th>
                            <th className="timesheet__shift-col">Sáng</th>
                            <th className="timesheet__shift-col">Trưa</th>
                            <th className="timesheet__shift-col">Chiều</th>
                            <th className="timesheet__status-col">Trạng thái</th>
                            <th className="timesheet__action-col">Duyệt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dayRecords.length === 0 && (
                            <tr>
                                <td colSpan={6} className="timesheet__empty">
                                    <Clock size={20} />
                                    <span>Chưa có chấm công ngày {dateStr}</span>
                                </td>
                            </tr>
                        )}
                        {dayRecords.map((record) => {
                            const statusInfo = STATUS_MAP[record.status] || STATUS_MAP.full;
                            return (
                                <tr key={record.id} className={record.exception ? 'timesheet__row--exception' : ''}>
                                    <td className="timesheet__name-cell">
                                        <strong>{record.userName}</strong>
                                    </td>
                                    {['morning', 'afternoon', 'evening'].map((shift) => (
                                        <td
                                            key={shift}
                                            className={`timesheet__shift-cell ${record.shifts[shift] ? 'timesheet__shift-cell--checked' : 'timesheet__shift-cell--empty'}`}
                                        >
                                            {record.shifts[shift] ? (
                                                <CheckCircle2 size={18} className="timesheet__check-icon" />
                                            ) : (
                                                <span className="timesheet__dash">—</span>
                                            )}
                                        </td>
                                    ))}
                                    <td className="timesheet__status-cell">
                                        <StatusBadge status={statusInfo.badge} label={statusInfo.label} />
                                    </td>
                                    <td className="timesheet__action-cell">
                                        {record.exception && record.exception.approved === null ? (
                                            <div className="timesheet__approval-actions">
                                                <button
                                                    className="btn btn--sm btn--success"
                                                    onClick={() => onApproveException?.(record.id, true)}
                                                    title="Duyệt"
                                                >
                                                    <CheckCheck size={14} />
                                                </button>
                                                <button
                                                    className="btn btn--sm btn--danger"
                                                    onClick={() => onApproveException?.(record.id, false)}
                                                    title="Từ chối"
                                                >
                                                    <XCircle size={14} />
                                                </button>
                                            </div>
                                        ) : record.exception?.approved === true ? (
                                            <span className="timesheet__approved-tag">✅ Đã duyệt</span>
                                        ) : record.exception?.approved === false ? (
                                            <span className="timesheet__rejected-tag">❌ Từ chối</span>
                                        ) : (
                                            <span className="timesheet__no-action">—</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Exception Detail (if any on this date) */}
            {dayRecords
                .filter((r) => r.exception)
                .map((r) => (
                    <div key={r.id} className="timesheet__exception-card">
                        <AlertTriangle size={16} className="timesheet__exception-icon" />
                        <div className="timesheet__exception-info">
                            <strong>{r.userName}</strong>: {r.exception.reason}
                            {r.exception.approved === null && (
                                <span className="timesheet__exception-pending"> — Chờ duyệt</span>
                            )}
                            {r.exception.approved === true && (
                                <span className="timesheet__exception-approved"> — Đã duyệt ✅</span>
                            )}
                        </div>
                    </div>
                ))}
        </div>
    );
};

TimesheetView.propTypes = {
    onApproveException: PropTypes.func,
};

export default TimesheetView;
