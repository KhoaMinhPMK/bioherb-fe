import React, { useMemo } from 'react';
import { Users, Clock, DollarSign, TrendingUp } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import { useData } from '../../contexts/DataContext';
import './WorkerStats.scss';

const WorkerStats = () => {
    const { workers: workersList, taskLogs } = useData();

    const stats = useMemo(() => {
        return workersList.map((w) => {
            const logs = taskLogs.filter((l) => l.workerName?.includes(w.name) || l.selectedWorkers?.includes(w.id));
            const totalDays = logs.length;
            const approvedDays = logs.filter((l) => l.status === 'approved').length;
            const dailyRate = w.dailyRate || 250000;
            const totalSalary = approvedDays * dailyRate;
            return {
                ...w,
                totalDays,
                approvedDays,
                pendingDays: totalDays - approvedDays,
                dailyRate,
                totalSalary,
                totalSalaryDisplay: totalSalary.toLocaleString('vi-VN'),
                dailyRateDisplay: dailyRate.toLocaleString('vi-VN'),
            };
        });
    }, [workersList, taskLogs]);

    const totalWorkers = workersList.length;
    const totalSalaryAll = stats.reduce((s, w) => s + w.totalSalary, 0);
    const totalDaysAll = stats.reduce((s, w) => s + w.totalDays, 0);

    const summaryCards = [
        { icon: Users, label: 'Tổng nhân công', value: totalWorkers },
        { icon: Clock, label: 'Tổng ngày công', value: totalDaysAll },
        { icon: DollarSign, label: 'Tổng lương (₫)', value: totalSalaryAll.toLocaleString('vi-VN') },
        {
            icon: TrendingUp,
            label: 'TB/người',
            value: totalWorkers > 0 ? Math.round(totalDaysAll / totalWorkers) + ' ngày' : '0',
        },
    ];

    const columns = [
        { key: 'name', label: 'Họ tên', sortable: true, render: (v) => <strong>{v}</strong> },
        { key: 'phone', label: 'SĐT', hideOnMobile: true },
        { key: 'totalDays', label: 'Tổng công', sortable: true },
        { key: 'approvedDays', label: 'Đã duyệt', sortable: true },
        { key: 'pendingDays', label: 'Chờ duyệt' },
        { key: 'dailyRateDisplay', label: 'Đơn giá', hideOnMobile: true },
        { key: 'totalSalaryDisplay', label: 'Tổng lương', sortable: true, render: (v) => <strong>{v} ₫</strong> },
    ];

    return (
        <div className="page-container">
            <PageHeader title="Thống kê nhân công" subtitle="Tổng hợp công và lương theo tháng" />

            <div className="worker-stats__summary">
                {summaryCards.map((s) => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="card">
                            <div className="card__body worker-stats__card">
                                <Icon size={20} className="worker-stats__card-icon" />
                                <div>
                                    <span className="worker-stats__card-label">{s.label}</span>
                                    <p className="worker-stats__card-value">{s.value}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="card">
                <div className="card__header">
                    <h3 className="font-semibold">Chi tiết nhân công</h3>
                </div>
                <DataTable columns={columns} data={stats} pageSize={10} />
            </div>
        </div>
    );
};

export default WorkerStats;
