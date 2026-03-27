import React, { useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronRight,
    Sprout,
    BookOpen,
    BookOpenCheck,
    Bug,
    CalendarDays,
    Eye,
    EyeOff,
} from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { useData } from '../../contexts/DataContext';
import { GACP_TYPE_MAP } from '../GACPDiary/gacpConstants';
import './CalendarView.scss';

const DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

// ─── Date helpers ────────────────────────────────
// Normalize any date format (DD/MM/YYYY or YYYY-MM-DD) to YYYY-MM-DD
const normalizeDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3 && parts[0].length <= 2) {
            return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
    }
    return dateStr; // Already YYYY-MM-DD
};

// ─── Event type config ──────────────────────────
const EVENT_TYPES = {
    plan: { label: 'K\u1EBF ho\u1EA1ch', icon: Sprout, colorClass: 'plan' },
    log: { label: 'Nh\u1EADt k\u00FD SX', icon: BookOpen, colorClass: 'log' },
    gacp: { label: 'GACP', icon: BookOpenCheck, colorClass: 'gacp' },
    pest: { label: 'S\u00E2u b\u1EC7nh', icon: Bug, colorClass: 'pest' },
    cycle: { label: 'M\u00F9a v\u1EE5', icon: CalendarDays, colorClass: 'cycle' },
};

const CalendarView = () => {
    const { taskPlans, taskLogs, gacpEntries, cropCycles, pestIncidents } = useData();
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [filters, setFilters] = useState({
        plan: true,
        log: true,
        gacp: true,
        pest: true,
        cycle: true,
    });

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthName = currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const calendarDays = useMemo(() => {
        const days = [];
        for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
        for (let d = 1; d <= daysInMonth; d++) days.push(d);
        return days;
    }, [firstDayOfWeek, daysInMonth]);

    // Build dateStr for comparison from day number
    const makeDateStr = useCallback(
        (day) => {
            return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        },
        [year, month],
    );

    // ─── Aggregate all events for a given day ─────
    const getEventsForDay = useCallback(
        (day) => {
            if (!day) return [];
            const dateStr = makeDateStr(day);
            const events = [];

            // 1. Task Plans (Ke hoach)
            if (filters.plan) {
                taskPlans.forEach((p) => {
                    if (normalizeDate(p.date) === dateStr) {
                        events.push({ type: 'plan', label: p.task || p.title, status: p.status, sourceId: p.id });
                    }
                });
            }

            // 2. Task Logs (Nhat ky san xuat)
            if (filters.log) {
                taskLogs.forEach((l) => {
                    if (normalizeDate(l.date) === dateStr) {
                        events.push({ type: 'log', label: l.task, status: l.status, sourceId: l.id });
                    }
                });
            }

            // 3. GACP Entries
            if (filters.gacp) {
                gacpEntries.forEach((e) => {
                    if (normalizeDate(e.date) === dateStr) {
                        const typeInfo = GACP_TYPE_MAP[e.type];
                        const shortLabel = typeInfo ? typeInfo.label : e.type;
                        events.push({ type: 'gacp', label: shortLabel, sourceId: e.id, gacpType: e.type });
                    }
                });
            }

            // 4. Pest Incidents
            if (filters.pest) {
                pestIncidents.forEach((p) => {
                    if (normalizeDate(p.date) === dateStr) {
                        events.push({ type: 'pest', label: p.type || 'Sâu bệnh', sourceId: p.id });
                    }
                });
            }

            // 5. Crop Cycles — show start and end dates
            if (filters.cycle) {
                cropCycles.forEach((c) => {
                    const startDate = normalizeDate(c.start);
                    const endDate = normalizeDate(c.end);
                    if (startDate === dateStr) {
                        events.push({ type: 'cycle', label: `${c.crop} (bắt đầu)`, sourceId: c.id });
                    }
                    if (endDate === dateStr) {
                        events.push({ type: 'cycle', label: `${c.crop} (kết thúc)`, sourceId: c.id });
                    }
                });
            }

            return events;
        },
        [makeDateStr, filters, taskPlans, taskLogs, gacpEntries, pestIncidents, cropCycles],
    );

    // ─── Summary counts for month ─────────────────
    const monthSummary = useMemo(() => {
        const counts = { plan: 0, log: 0, gacp: 0, pest: 0, cycle: 0 };
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = makeDateStr(d);
            taskPlans.forEach((p) => {
                if (normalizeDate(p.date) === dateStr) counts.plan++;
            });
            taskLogs.forEach((l) => {
                if (normalizeDate(l.date) === dateStr) counts.log++;
            });
            gacpEntries.forEach((e) => {
                if (normalizeDate(e.date) === dateStr) counts.gacp++;
            });
            pestIncidents.forEach((p) => {
                if (normalizeDate(p.date) === dateStr) counts.pest++;
            });
        }
        cropCycles.forEach((c) => {
            const s = normalizeDate(c.start);
            const e = normalizeDate(c.end);
            const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
            if (s?.startsWith(monthPrefix) || e?.startsWith(monthPrefix)) counts.cycle++;
        });
        return counts;
    }, [daysInMonth, makeDateStr, taskPlans, taskLogs, gacpEntries, pestIncidents, cropCycles, year, month]);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const goToday = () => setCurrentDate(new Date());
    const today = new Date();
    const isToday = (day) => day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

    const toggleFilter = useCallback((key) => {
        setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
    }, []);

    // ─── Click handler: navigate to detail page ──
    const handleEventClick = useCallback(
        (ev) => {
            switch (ev.type) {
                case 'plan':
                    navigate('/task-plans');
                    break;
                case 'log':
                    navigate(`/task-logs`);
                    break;
                case 'gacp':
                    // Navigate to task-logs page and auto-switch to GACP tab
                    navigate('/task-logs', { state: { activeTab: 'gacp' } });
                    window.dispatchEvent(new CustomEvent('sidebar:request-collapse', { detail: true }));
                    break;
                case 'pest':
                    navigate('/pest-incidents');
                    break;
                case 'cycle':
                    navigate(`/crop-cycles`);
                    break;
                default:
                    break;
            }
        },
        [navigate],
    );

    return (
        <div className="page-container">
            <PageHeader
                title="L\u1ECBch canh t\u00E1c"
                subtitle="T\u1ED5ng h\u1EE3p k\u1EBF ho\u1EA1ch, nh\u1EADt k\u00FD, GACP, s\u00E2u b\u1EC7nh theo l\u1ECBch"
            />

            {/* ── Filter Toolbar ───────────────── */}
            <div className="calendar__filters">
                {Object.entries(EVENT_TYPES).map(([key, { label, colorClass }]) => (
                    <button
                        key={key}
                        className={`calendar__filter-btn calendar__filter-btn--${colorClass} ${filters[key] ? '' : 'calendar__filter-btn--off'}`}
                        onClick={() => toggleFilter(key)}
                        title={filters[key] ? `\u1EA8n ${label}` : `Hi\u1EC7n ${label}`}
                    >
                        {filters[key] ? <Eye size={12} /> : <EyeOff size={12} />}
                        <span>{label}</span>
                        <span className="calendar__filter-count">{monthSummary[key]}</span>
                    </button>
                ))}
            </div>

            <div className="card">
                {/* ── Navigation ───────────────── */}
                <div className="calendar__nav">
                    <button className="btn-icon" onClick={prevMonth}>
                        <ChevronLeft size={20} />
                    </button>
                    <h3 className="calendar__month-name">{monthName}</h3>
                    <button className="btn btn--outline btn--xs" onClick={goToday}>
                        H\u00F4m nay
                    </button>
                    <button className="btn-icon" onClick={nextMonth}>
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* ── Grid ─────────────────────── */}
                <div className="calendar__grid">
                    {DAYS.map((d) => (
                        <div key={d} className="calendar__day-header">
                            {d}
                        </div>
                    ))}
                    {calendarDays.map((day, idx) => {
                        const events = getEventsForDay(day);
                        return (
                            <div
                                key={day != null ? `day-${day}` : `empty-${idx}`}
                                className={`calendar__cell ${!day ? 'calendar__cell--empty' : ''} ${isToday(day) ? 'calendar__cell--today' : ''} ${events.length > 0 ? 'calendar__cell--has-events' : ''}`}
                            >
                                {day && (
                                    <>
                                        <span className="calendar__date">{day}</span>
                                        <div className="calendar__events">
                                            {events.slice(0, 3).map((ev) => {
                                                const EvIcon = EVENT_TYPES[ev.type]?.icon || BookOpen;
                                                return (
                                                    <div
                                                        key={`${ev.type}-${ev.sourceId}-${ev.label}`}
                                                        className={`calendar__event calendar__event--${ev.type}`}
                                                        title={ev.label}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEventClick(ev);
                                                        }}
                                                    >
                                                        <EvIcon size={10} />
                                                        <span>{ev.label}</span>
                                                    </div>
                                                );
                                            })}
                                            {events.length > 3 && (
                                                <span className="calendar__more">+{events.length - 3}</span>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* ── Legend ────────────────────── */}
                <div className="calendar__legend">
                    {Object.entries(EVENT_TYPES).map(([key, { label, icon: Icon, colorClass }]) => (
                        <span key={key} className={`calendar__legend-item calendar__legend-item--${colorClass}`}>
                            <Icon size={12} /> {label}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
