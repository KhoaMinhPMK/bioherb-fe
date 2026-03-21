import React, { useState, useMemo } from 'react';
import { Plus, CalendarDays } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import FilterBar from '../../components/FilterBar';
const allPlans = [
    { id: 1, date: '01/01/2026', task: 'Cày xới đất', supply: '50kg Vôi', workers: 'Trần Văn Tài, Nguyễn An', equipment: 'Máy cày', time: '7h - 17h' },
    { id: 2, date: '25/01/2026', task: 'Bón lót', supply: '8 tấn phân hữu cơ', workers: 'Nguyễn Văn Phương, Lê Thị Cúc', equipment: '—', time: '8h - 12h' },
    { id: 3, date: '01/02/2026', task: 'Gieo sạ', supply: '1 bao hạt giống', workers: 'Nguyễn An, Lê Thị Cúc', equipment: '—', time: '7h - 9h' },
    { id: 4, date: '25/03/2026', task: 'Bón phân', supply: '440kg Lân đỏ', workers: 'Trần Văn Tài, Nguyễn An', equipment: '—', time: '8h - 11h' },
    { id: 5, date: '19/04/2026', task: 'Phun thuốc', supply: '600gr Sieubymsa 75WP', workers: 'Nguyễn Văn Phương, Lê Thị Cúc', equipment: '—', time: '8h - 10h' },
    { id: 6, date: '25/05/2026', task: 'Thu hoạch', supply: '500 bao đựng lúa', workers: '4 người', equipment: 'Máy gặt', time: '7h - 17h' },
];
const columns = [
    { key: 'date', label: 'Ngày', sortable: true, width: '100px' },
    {
        key: 'task', label: 'Công việc', sortable: true,
        render: (val) => <span style={{ fontWeight: 500 }}>{val}</span>
    },
    { key: 'supply', label: 'Vật tư' },
    { key: 'workers', label: 'Nhân công' },
    { key: 'equipment', label: 'Thiết bị' },
    { key: 'time', label: 'Thời gian', width: '100px' },
];
const TaskPlanList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredPlans = useMemo(() => {
        if (!searchTerm)
            return allPlans;
        const term = searchTerm.toLowerCase();
        return allPlans.filter((p) => p.task.toLowerCase().includes(term) ||
            p.supply.toLowerCase().includes(term) ||
            p.workers.toLowerCase().includes(term));
    }, [searchTerm]);
    return (<div className="page-container">
            <PageHeader title="Kế hoạch công việc" subtitle="Lập kế hoạch sản xuất theo mùa vụ" actions={<button className="btn btn--primary" onClick={() => window.addToast('Tính năng thêm kế hoạch đang phát triển', 'info')}>
                        <Plus size={16}/> Thêm kế hoạch
                    </button>}/>

            <FilterBar searchPlaceholder="Tìm kế hoạch..." onSearch={setSearchTerm}/>

            <div className="card">
                <div className="card__header">
                    <h3 className="task-plan__section-title">
                        <CalendarDays size={18} aria-hidden="true"/>
                        Kế hoạch Trồng lúa 2026 — Lúa ST25
                    </h3>
                </div>
                <DataTable columns={columns} data={filteredPlans} pageSize={10}/>
            </div>
        </div>);
};
export default TaskPlanList;
