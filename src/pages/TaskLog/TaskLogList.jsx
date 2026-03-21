import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BookOpen, List, CalendarDays } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import FilterBar from '../../components/FilterBar';
import StatusBadge from '../../components/StatusBadge';
import DetailDrawer from '../../components/DetailDrawer';
import TimesheetView from '../../components/TimesheetView';
import './TaskLog.scss';
const allLogs = [
    { id: 1, date: '21/03/2026', task: 'Bón phân', cycle: '2026-DX', workers: 'Nguyễn An, Trần Văn Tài', supply: '440kg Lân đỏ', cost: 6600000, costDisplay: '6.600.000', status: 'approved', time: '8h-11h', hours: 3 },
    { id: 2, date: '19/03/2026', task: 'Phun thuốc', cycle: '2026-DX', workers: 'Lê Thị Cúc, Nguyễn Văn Phương', supply: '600gr Sieubymsa 75WP', cost: 7200000, costDisplay: '7.200.000', status: 'approved', time: '8h-10h', hours: 2 },
    { id: 3, date: '18/03/2026', task: 'Tưới nước', cycle: '2026-XH', workers: 'Nguyễn An', supply: '—', cost: 90000, costDisplay: '90.000', status: 'pending', time: '7h-9h', hours: 2 },
    { id: 4, date: '17/03/2026', task: 'Gieo sạ', cycle: '2026-DX', workers: 'Nguyễn An, Lê Thị Cúc', supply: '1 bao hạt giống', cost: 120000, costDisplay: '120.000', status: 'approved', time: '7h-9h', hours: 2 },
    { id: 5, date: '20/03/2026', task: 'Bón lót', cycle: '2026-DX', workers: 'Nguyễn Văn Phương, Lê Thị Cúc', supply: '8 tấn phân hữu cơ', cost: 14400000, costDisplay: '14.400.000', status: 'approved', time: '8h-12h', hours: 4 },
    { id: 6, date: '20/03/2026', task: 'Cày xới đất', cycle: '2026-DX', workers: 'Trần Văn Tài, Nguyễn An', supply: '50kg Vôi', cost: 3200000, costDisplay: '3.200.000', status: 'approved', time: '7h-17h', hours: 10 },
    { id: 7, date: '21/03/2026', task: 'Dọn ruộng', cycle: '2026-DX', workers: 'Nguyễn An', supply: '—', cost: 500000, costDisplay: '500.000', status: 'approved', time: '7h-12h', hours: 5 },
    { id: 8, date: '10/02/2026', task: 'Tưới nước', cycle: '2026-XH', workers: 'Nguyễn Văn Phương', supply: '—', cost: 90000, costDisplay: '90.000', status: 'draft', time: '7h-9h', hours: 2 },
    { id: 9, date: '05/02/2026', task: 'Kiểm tra sâu bệnh', cycle: '2026-DX', workers: 'Lê Thị Cúc', supply: '—', cost: 0, costDisplay: '0', status: 'pending', time: '8h-10h', hours: 2 },
    { id: 10, date: '01/02/2026', task: 'Bón phân lót', cycle: '2026-XH', workers: 'Trần Văn Tài', supply: '4 tấn phân hữu cơ', cost: 7200000, costDisplay: '7.200.000', status: 'approved', time: '8h-12h', hours: 4 },
    { id: 11, date: '28/01/2026', task: 'Gieo hạt', cycle: '2026-XH', workers: 'Nguyễn An, Lê Thị Cúc', supply: '500g hạt giống cà chua', cost: 350000, costDisplay: '350.000', status: 'approved', time: '7h-10h', hours: 3 },
    { id: 12, date: '25/01/2026', task: 'Chuẩn bị đất', cycle: '2026-XH', workers: 'Trần Văn Tài', supply: '30kg Vôi', cost: 1800000, costDisplay: '1.800.000', status: 'approved', time: '7h-15h', hours: 8 },
];
const columns = [
    { key: 'date', label: 'Ngày', sortable: true, width: '100px' },
    {
        key: 'task', label: 'Công việc', sortable: true,
        render: (val) => (<span className="task-log__task-cell">
                <BookOpen size={14} aria-hidden="true"/>
                {val}
            </span>)
    },
    {
        key: 'cycle', label: 'Mùa vụ', sortable: true,
        render: (val) => <code className="task-log__cycle-code">{val}</code>
    },
    { key: 'workers', label: 'Nhân công' },
    { key: 'supply', label: 'Vật tư' },
    { key: 'time', label: 'Thời gian', width: '90px' },
    {
        key: 'cost', label: 'Chi phí', sortable: true,
        render: (_, row) => <span>{row.costDisplay} ₫</span>
    },
    {
        key: 'status', label: 'Trạng thái', sortable: true,
        render: (val) => <StatusBadge status={val}/>
    },
];
const filterConfigs = [
    {
        key: 'status',
        label: 'Trạng thái',
        options: [
            { value: 'approved', label: 'Đã duyệt' },
            { value: 'pending', label: 'Chờ duyệt' },
            { value: 'draft', label: 'Nháp' },
        ]
    },
    {
        key: 'cycle',
        label: 'Mùa vụ',
        options: [
            { value: '2026-DX', label: '2026-DX' },
            { value: '2026-XH', label: '2026-XH' },
        ]
    },
];
const TaskLogList = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({});
    const [selectedLog, setSelectedLog] = useState(null);
    const [weekStatus, setWeekStatus] = useState('draft');
    const filteredLogs = useMemo(() => {
        return allLogs.filter((log) => {
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const match = log.task.toLowerCase().includes(term)
                    || log.workers.toLowerCase().includes(term)
                    || log.supply.toLowerCase().includes(term);
                if (!match)
                    return false;
            }
            if (filters.status && log.status !== filters.status)
                return false;
            if (filters.cycle && log.cycle !== filters.cycle)
                return false;
            return true;
        });
    }, [searchTerm, filters]);
    const handleSubmitWeek = () => {
        setWeekStatus('submitted');
    };
    return (<div className="page-container">
            <PageHeader title="Nhật ký sản xuất" subtitle="Ghi chép công việc thực tế mùa vụ" actions={<button className="btn btn--primary" onClick={() => navigate('/task-logs/new')}>
                        <Plus size={16}/> Ghi nhật ký
                    </button>}/>

            {/* Tabs */}
            <div className="task-log__tabs" role="tablist">
                <button role="tab" aria-selected={activeTab === 'list'} className={`task-log__tab ${activeTab === 'list' ? 'task-log__tab--active' : ''}`} onClick={() => setActiveTab('list')}>
                    <List size={16}/> Danh sách
                </button>
                <button role="tab" aria-selected={activeTab === 'timesheet'} className={`task-log__tab ${activeTab === 'timesheet' ? 'task-log__tab--active' : ''}`} onClick={() => setActiveTab('timesheet')}>
                    <CalendarDays size={16}/> Timesheet
                </button>
            </div>

            {/* List View */}
            {activeTab === 'list' && (<>
                    <FilterBar searchPlaceholder="Tìm nhật ký..." onSearch={setSearchTerm} filters={filterConfigs} onFilterChange={setFilters}/>
                    <div className="card">
                        <DataTable columns={columns} data={filteredLogs} pageSize={10} onRowClick={(row) => setSelectedLog(row)}/>
                    </div>
                </>)}

            {/* Timesheet View */}
            {activeTab === 'timesheet' && (<div className="card" style={{ padding: 16 }}>
                    <TimesheetView logs={allLogs} weekStatus={weekStatus} onSubmit={handleSubmitWeek}/>
                </div>)}

            <DetailDrawer isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} title={selectedLog ? `${selectedLog.task} — ${selectedLog.date}` : ''}>
                {selectedLog && (<div className="task-log__detail">
                        <div className="task-log__detail-section">
                            <h4 className="task-log__detail-title">Thông tin chung</h4>
                            <div className="task-log__detail-grid">
                                <div className="task-log__detail-field">
                                    <label>Ngày thực hiện</label>
                                    <span>{selectedLog.date}</span>
                                </div>
                                <div className="task-log__detail-field">
                                    <label>Khung giờ</label>
                                    <span>{selectedLog.time}</span>
                                </div>
                                <div className="task-log__detail-field">
                                    <label>Mùa vụ</label>
                                    <code className="task-log__cycle-code">{selectedLog.cycle}</code>
                                </div>
                                <div className="task-log__detail-field">
                                    <label>Trạng thái duyệt</label>
                                    <div><StatusBadge status={selectedLog.status}/></div>
                                </div>
                            </div>
                        </div>

                        <div className="task-log__detail-section">
                            <h4 className="task-log__detail-title">Hao phí Sản xuất</h4>
                            <div className="task-log__detail-grid">
                                <div className="task-log__detail-field">
                                    <label>Nhân công</label>
                                    <span>{selectedLog.workers}</span>
                                </div>
                                <div className="task-log__detail-field">
                                    <label>Vật tư sử dụng</label>
                                    <span>{selectedLog.supply}</span>
                                </div>
                            </div>
                        </div>

                        <div className="task-log__detail-section task-log__detail-section--highlight">
                            <div className="task-log__detail-grid" style={{ gridTemplateColumns: '1fr' }}>
                                <div className="task-log__detail-field">
                                    <label>Tổng chi phí ước tính</label>
                                    <span className="task-log__detail-cost">{selectedLog.costDisplay} ₫</span>
                                </div>
                            </div>
                        </div>
                    </div>)}
            </DetailDrawer>
        </div>);
};
export default TaskLogList;
