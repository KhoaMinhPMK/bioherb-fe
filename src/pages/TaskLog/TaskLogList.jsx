import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BookOpen, List, CalendarDays } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import FilterBar from '../../components/FilterBar';
import StatusBadge from '../../components/StatusBadge';
import DetailDrawer from '../../components/DetailDrawer';
import TimesheetView from '../../components/TimesheetView';
import { useToast } from '../../contexts/ToastContext';
import { taskLogs } from '../../data/mockData';
import './TaskLog.scss';

// Columns — removed cost (boss requirement #15), added shift
const columns = [
    { key: 'date', label: 'Ngày', sortable: true, width: '100px' },
    {
        key: 'task', label: 'Công việc', sortable: true,
        render: (val) => (
            <span className="task-log__task-cell">
                <BookOpen size={14} aria-hidden="true" />
                {val}
            </span>
        ),
    },
    {
        key: 'plotId', label: 'Vùng trồng', sortable: true,
        render: (val) => <code className="task-log__cycle-code">{val}</code>,
    },
    { key: 'workerName', label: 'Nhân công' },
    {
        key: 'shift', label: 'Buổi',
        render: (val) => {
            const map = { morning: 'Sáng', afternoon: 'Trưa', evening: 'Chiều' };
            return <span className="task-log__shift-badge">{map[val] || val}</span>;
        },
    },
    {
        key: 'status', label: 'Trạng thái', sortable: true,
        render: (val) => <StatusBadge status={val} />,
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
        ],
    },
    {
        key: 'type',
        label: 'Loại',
        options: [
            { value: 'seed', label: 'Giống' },
            { value: 'fertilizer', label: 'Phân bón' },
            { value: 'pest', label: 'Sâu bệnh' },
            { value: 'farming', label: 'Canh tác' },
        ],
    },
];

const TaskLogList = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({});
    const [selectedLog, setSelectedLog] = useState(null);

    // Use real mockData task logs
    const filteredLogs = useMemo(() => {
        return taskLogs.filter((log) => {
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const match =
                    log.task.toLowerCase().includes(term) ||
                    log.workerName.toLowerCase().includes(term) ||
                    log.plotId.toLowerCase().includes(term);
                if (!match) return false;
            }
            if (filters.status && log.status !== filters.status) return false;
            if (filters.type && log.type !== filters.type) return false;
            return true;
        });
    }, [searchTerm, filters]);

    const handleApproveException = (id, approved) => {
        addToast(
            approved ? `Đã duyệt ngoại lệ ${id}` : `Đã từ chối ngoại lệ ${id}`,
            approved ? 'success' : 'error'
        );
    };

    return (
        <div className="page-container">
            <PageHeader
                title="Nhật ký sản xuất"
                subtitle="Ghi chép công việc và chấm công theo buổi"
                actions={
                    <button className="btn btn--primary" onClick={() => navigate('/task-logs/new')}>
                        <Plus size={16} /> Ghi nhật ký
                    </button>
                }
            />

            {/* Tabs */}
            <div className="task-log__tabs" role="tablist">
                <button
                    role="tab"
                    aria-selected={activeTab === 'list'}
                    className={`task-log__tab ${activeTab === 'list' ? 'task-log__tab--active' : ''}`}
                    onClick={() => setActiveTab('list')}
                >
                    <List size={16} /> Danh sách
                </button>
                <button
                    role="tab"
                    aria-selected={activeTab === 'timesheet'}
                    className={`task-log__tab ${activeTab === 'timesheet' ? 'task-log__tab--active' : ''}`}
                    onClick={() => setActiveTab('timesheet')}
                >
                    <CalendarDays size={16} /> Chấm công
                </button>
            </div>

            {/* List View */}
            {activeTab === 'list' && (
                <>
                    <FilterBar
                        searchPlaceholder="Tìm nhật ký..."
                        onSearch={setSearchTerm}
                        filters={filterConfigs}
                        onFilterChange={setFilters}
                    />
                    <div className="card">
                        <DataTable
                            columns={columns}
                            data={filteredLogs}
                            pageSize={10}
                            onRowClick={(row) => setSelectedLog(row)}
                        />
                    </div>
                </>
            )}

            {/* Timesheet / Attendance View */}
            {activeTab === 'timesheet' && (
                <div className="card" style={{ padding: 16 }}>
                    <TimesheetView onApproveException={handleApproveException} />
                </div>
            )}

            <DetailDrawer
                isOpen={!!selectedLog}
                onClose={() => setSelectedLog(null)}
                title={selectedLog ? `${selectedLog.task} — ${selectedLog.date}` : ''}
            >
                {selectedLog && (
                    <div className="task-log__detail">
                        <div className="task-log__detail-section">
                            <h4 className="task-log__detail-title">Thông tin chung</h4>
                            <div className="task-log__detail-grid">
                                <div className="task-log__detail-field">
                                    <label>Ngày thực hiện</label>
                                    <span>{selectedLog.date}</span>
                                </div>
                                <div className="task-log__detail-field">
                                    <label>Buổi</label>
                                    <span>
                                        {{ morning: 'Sáng', afternoon: 'Trưa', evening: 'Chiều' }[selectedLog.shift] || selectedLog.shift}
                                    </span>
                                </div>
                                <div className="task-log__detail-field">
                                    <label>Vùng trồng</label>
                                    <code className="task-log__cycle-code">{selectedLog.plotId}</code>
                                </div>
                                <div className="task-log__detail-field">
                                    <label>Trạng thái duyệt</label>
                                    <div><StatusBadge status={selectedLog.status} /></div>
                                </div>
                            </div>
                        </div>

                        <div className="task-log__detail-section">
                            <h4 className="task-log__detail-title">Chi tiết</h4>
                            <div className="task-log__detail-grid">
                                <div className="task-log__detail-field">
                                    <label>Nhân công</label>
                                    <span>{selectedLog.workerName}</span>
                                </div>
                                <div className="task-log__detail-field">
                                    <label>Vật tư sử dụng</label>
                                    <span>{selectedLog.material || '—'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </DetailDrawer>
        </div>
    );
};

export default TaskLogList;
