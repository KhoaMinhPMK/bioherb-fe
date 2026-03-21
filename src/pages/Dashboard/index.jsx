import React from 'react';
import { AlertTriangle, Calendar, ArrowRight, Clock, CheckCircle2, AlertCircle, FileCheck, TrendingUp } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import PageHeader from '../../components/PageHeader';
import Dropdown from '../../components/Dropdown';
import './Dashboard.scss';
// --- Mock data: role-appropriate for operations overview ---
const stats = [
    { label: 'Trễ hạn', value: '3', icon: AlertCircle, variant: 'error' },
    { label: 'Hôm nay', value: '5', icon: Calendar, variant: 'info' },
    { label: 'Giờ tuần này', value: '32h', icon: Clock, variant: 'neutral' },
    { label: 'Chờ duyệt', value: '4', icon: FileCheck, variant: 'warning' },
];
const todayTasks = [
    { id: 1, time: '07:00–09:00', task: 'Tưới nước — Ruộng cà chua VT02', assignee: 'Nguyễn An', status: 'in-progress', priority: 'high' },
    { id: 2, time: '08:00–11:00', task: 'Bón phân đợt 2 — Lúa ST25 VT01', assignee: 'Trần Văn Tài', status: 'pending', priority: 'high' },
    { id: 3, time: '08:00–10:00', task: 'Kiểm tra sâu bệnh — VT03', assignee: 'Lê Thị Cúc', status: 'pending', priority: 'medium' },
    { id: 4, time: '13:00–15:00', task: 'Phun thuốc phòng — Ruộng cà chua', assignee: 'Nguyễn Văn Phương', status: 'pending', priority: 'medium' },
    { id: 5, time: '14:00–16:00', task: 'Ghi nhật ký tuần — Mùa vụ 2026-DX', assignee: 'Nguyễn Thị Bình', status: 'pending', priority: 'low' },
];
const alerts = [
    { type: 'error', message: 'Tồn kho Sieubymsa 75WP dưới mức tối thiểu', time: '1 giờ trước' },
    { type: 'warning', message: 'Phát hiện đạo ôn tại VT03 — cần xử lý', time: '2 giờ trước' },
    { type: 'info', message: 'Mùa vụ 2026-DX sắp đến giai đoạn thu hoạch', time: '5 giờ trước' },
];
const upcomingTasks = [
    { date: '22/03', task: 'Bón phân đợt 2', plot: 'Ruộng lúa ST25' },
    { date: '24/03', task: 'Phun thuốc phòng', plot: 'Ruộng cà chua' },
    { date: '26/03', task: 'Kiểm tra sinh trưởng', plot: 'Ruộng lúa ST25' },
    { date: '28/03', task: 'Tưới nước định kỳ', plot: 'Ruộng cà chua' },
];
const weeklyHours = [
    { day: 'T2', hours: 6, max: 8 },
    { day: 'T3', hours: 7, max: 8 },
    { day: 'T4', hours: 5, max: 8 },
    { day: 'T5', hours: 8, max: 8 },
    { day: 'T6', hours: 6, max: 8 },
    { day: 'T7', hours: 0, max: 8 },
    { day: 'CN', hours: 0, max: 8 },
];
const recentLogs = [
    { date: '21/03', task: 'Bón phân — Lúa ST25', user: 'Nguyễn An', status: 'approved' },
    { date: '20/03', task: 'Phun thuốc đạo ôn', user: 'Lê Thị Cúc', status: 'approved' },
    { date: '20/03', task: 'Kiểm tra sâu bệnh', user: 'Trần Văn Tài', status: 'pending' },
];
const getPriorityClass = (p) => {
    if (p === 'high')
        return 'dashboard__task-priority--high';
    if (p === 'medium')
        return 'dashboard__task-priority--medium';
    return 'dashboard__task-priority--low';
};
const Dashboard = () => {
    return (<div className="dashboard page-container">
            <PageHeader title="Dashboard" subtitle="Tổng quan hoạt động sản xuất nông nghiệp" actions={<div style={{ width: 180 }}>
                        <Dropdown options={[
                    { value: 'all', label: 'Tất cả Farm' },
                    { value: 'f1', label: 'Farm Long An' },
                    { value: 'f2', label: 'Farm Đồng Tháp' },
                ]} value="all" onChange={() => { }} placeholder="Chọn Farm"/>
                    </div>}/>

            {/* KPI Row — 4 compact stat cards */}
            <div className="dashboard__stats">
                {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (<div key={i} className={`dashboard__stat dashboard__stat--${stat.variant}`}>
                            <div className="dashboard__stat-icon">
                                <Icon size={20} aria-hidden="true"/>
                            </div>
                            <div className="dashboard__stat-info">
                                <span className="dashboard__stat-value">{stat.value}</span>
                                <span className="dashboard__stat-label">{stat.label}</span>
                            </div>
                        </div>);
        })}
            </div>

            {/* Main Row: Focal Block + Right Sidebar */}
            <div className="dashboard__main">
                {/* FOCAL BLOCK: Việc hôm nay */}
                <div className="card dashboard__focal">
                    <div className="card__header">
                        <h2 className="dashboard__section-title">
                            <Calendar size={18} aria-hidden="true"/>
                            Việc hôm nay
                            <span className="dashboard__count">{todayTasks.length}</span>
                        </h2>
                        <a href="/task-plans" className="dashboard__view-all">
                            Xem tất cả <ArrowRight size={14}/>
                        </a>
                    </div>
                    <div className="dashboard__task-list">
                        {todayTasks.map((task) => (<div key={task.id} className="dashboard__task-item">
                                <div className={`dashboard__task-priority ${getPriorityClass(task.priority)}`}/>
                                <div className="dashboard__task-time">{task.time}</div>
                                <div className="dashboard__task-info">
                                    <span className="dashboard__task-name">{task.task}</span>
                                    <span className="dashboard__task-assignee">{task.assignee}</span>
                                </div>
                                <StatusBadge status={task.status}/>
                            </div>))}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="dashboard__sidebar">
                    {/* Alerts */}
                    <div className="card">
                        <div className="card__header">
                            <h3 className="dashboard__section-title dashboard__section-title--sm">
                                <AlertTriangle size={16} aria-hidden="true"/>
                                Cảnh báo
                            </h3>
                        </div>
                        <div className="dashboard__alerts">
                            {alerts.map((alert, i) => (<div key={i} className={`dashboard__alert dashboard__alert--${alert.type}`}>
                                    <div className="dashboard__alert-dot"/>
                                    <div className="dashboard__alert-content">
                                        <p className="dashboard__alert-msg">{alert.message}</p>
                                        <span className="dashboard__alert-time">{alert.time}</span>
                                    </div>
                                </div>))}
                        </div>
                    </div>

                    {/* Upcoming */}
                    <div className="card">
                        <div className="card__header">
                            <h3 className="dashboard__section-title dashboard__section-title--sm">
                                <TrendingUp size={16} aria-hidden="true"/>
                                Sắp tới
                            </h3>
                        </div>
                        <div className="dashboard__upcoming">
                            {upcomingTasks.map((task, i) => (<div key={i} className="dashboard__upcoming-item">
                                    <span className="dashboard__upcoming-date">{task.date}</span>
                                    <div className="dashboard__upcoming-info">
                                        <span className="dashboard__upcoming-task">{task.task}</span>
                                        <span className="dashboard__upcoming-plot">{task.plot}</span>
                                    </div>
                                </div>))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Weekly Hours + Recent Logs */}
            <div className="dashboard__bottom">
                {/* Weekly worklog summary */}
                <div className="card">
                    <div className="card__header">
                        <h3 className="dashboard__section-title dashboard__section-title--sm">
                            <Clock size={16} aria-hidden="true"/>
                            Giờ công tuần này
                        </h3>
                        <span className="dashboard__week-total">
                            {weeklyHours.reduce((s, d) => s + d.hours, 0)}h / {weeklyHours.reduce((s, d) => s + d.max, 0)}h
                        </span>
                    </div>
                    <div className="dashboard__week-chart">
                        {weeklyHours.map((d, i) => (<div key={i} className="dashboard__week-day">
                                <div className="dashboard__week-bar-track">
                                    <div className={`dashboard__week-bar-fill ${d.hours === 0 ? 'dashboard__week-bar-fill--empty' : ''}`} style={{ height: `${d.max > 0 ? (d.hours / d.max) * 100 : 0}%` }}/>
                                </div>
                                <span className="dashboard__week-hours">{d.hours}h</span>
                                <span className="dashboard__week-label">{d.day}</span>
                            </div>))}
                    </div>
                </div>

                {/* Recent logs */}
                <div className="card">
                    <div className="card__header">
                        <h3 className="dashboard__section-title dashboard__section-title--sm">
                            <CheckCircle2 size={16} aria-hidden="true"/>
                            Nhật ký gần đây
                        </h3>
                        <a href="/task-logs" className="dashboard__view-all">
                            Xem tất cả <ArrowRight size={14}/>
                        </a>
                    </div>
                    <div className="dashboard__recent-logs">
                        {recentLogs.map((log, i) => (<div key={i} className="dashboard__log-item">
                                <span className="dashboard__log-date">{log.date}</span>
                                <span className="dashboard__log-task">{log.task}</span>
                                <span className="dashboard__log-user">{log.user}</span>
                                <StatusBadge status={log.status}/>
                            </div>))}
                    </div>
                </div>
            </div>
        </div>);
};
export default Dashboard;
