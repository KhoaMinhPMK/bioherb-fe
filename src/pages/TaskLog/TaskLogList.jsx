import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, BookOpen, List, CalendarDays, Check, XCircle, Trash2, Edit, BookOpenCheck } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import FilterBar from '../../components/FilterBar';
import StatusBadge from '../../components/StatusBadge';
import DetailDrawer from '../../components/DetailDrawer';
import TimesheetView from '../../components/TimesheetView';
import Modal from '../../components/Modal';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import './TaskLog.scss';

const GACPDiaryView = React.lazy(() => import('../GACPDiary/GACPDiaryView'));

const filterConfigs = [
    {
        key: 'status',
        label: 'Trạng thái',
        options: [
            { value: 'approved', label: 'Đã duyệt' },
            { value: 'pending', label: 'Chờ duyệt' },
            { value: 'draft', label: 'Nháp' },
            { value: 'rejected', label: 'Từ chối' },
        ],
    },
];

const TaskLogList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addToast } = useToast();
    const { isFarmManager, isAdmin } = useAuth();
    const { taskLogs, approveTaskLog, rejectTaskLog, deleteTaskLog, isLoading } = useData();
    const [activeTab, setActiveTab] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({});
    const [selectedLog, setSelectedLog] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Auto-switch tab if navigated from calendar with state
    useEffect(() => {
        if (location.state?.activeTab === 'gacp') {
            setActiveTab('gacp');
            window.dispatchEvent(new CustomEvent('sidebar:request-collapse', { detail: true }));
            // Clear state to avoid re-triggering on refresh
            window.history.replaceState({}, '');
        }
    }, [location.state]);

    const canApprove = isAdmin || isFarmManager;

    const filteredLogs = useMemo(() => {
        return taskLogs.filter((log) => {
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const match =
                    log.task?.toLowerCase().includes(term) ||
                    log.workerName?.toLowerCase().includes(term) ||
                    log.plotId?.toLowerCase().includes(term);
                if (!match) return false;
            }
            if (filters.status && log.status !== filters.status) return false;
            return true;
        });
    }, [taskLogs, searchTerm, filters]);

    const handleApprove = useCallback(
        async (logId) => {
            await approveTaskLog(logId);
            addToast('Đã duyệt nhật ký', 'success');
            setSelectedLog(null);
        },
        [approveTaskLog, addToast],
    );

    const handleReject = useCallback(
        async (logId) => {
            await rejectTaskLog(logId);
            addToast('Đã từ chối nhật ký', 'error');
            setSelectedLog(null);
        },
        [rejectTaskLog, addToast],
    );

    const handleDelete = useCallback(async () => {
        await deleteTaskLog(deleteConfirm.id);
        addToast('Đã xóa nhật ký', 'success');
        setDeleteConfirm(null);
    }, [deleteConfirm, deleteTaskLog, addToast]);

    const handleApproveException = (id, approved) => {
        addToast(approved ? `Đã duyệt ngoại lệ ${id}` : `Đã từ chối ngoại lệ ${id}`, approved ? 'success' : 'error');
    };

    const columns = useMemo(
        () => [
            { key: 'date', label: 'Ngày', sortable: true, width: '100px' },
            {
                key: 'task',
                label: 'Công việc',
                sortable: true,
                render: (val) => (
                    <span className="task-log__task-cell">
                        <BookOpen size={14} aria-hidden="true" />
                        {val}
                    </span>
                ),
            },
            {
                key: 'plotId',
                label: 'VT',
                sortable: true,
                render: (val) => <code className="task-log__cycle-code">{val}</code>,
            },
            { key: 'workerName', label: 'Nhân công', hideOnMobile: true },
            {
                key: 'status',
                label: 'TT',
                sortable: true,
                render: (val) => <StatusBadge status={val} />,
            },
            {
                key: '_actions',
                label: '',
                width: '110px',
                render: (_, row) => (
                    <div className="table-actions">
                        {canApprove && row.status === 'pending' && (
                            <>
                                <button
                                    className="btn-icon"
                                    title="Duyệt"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleApprove(row.id);
                                    }}
                                >
                                    <Check size={14} />
                                </button>
                                <button
                                    className="btn-icon btn-icon--danger"
                                    title="Từ chối"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleReject(row.id);
                                    }}
                                >
                                    <XCircle size={14} />
                                </button>
                            </>
                        )}
                        <button
                            className="btn-icon"
                            title="Sửa"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/task-logs/${row.id}/edit`);
                            }}
                        >
                            <Edit size={14} />
                        </button>
                        <button
                            className="btn-icon btn-icon--danger"
                            title="Xóa"
                            onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirm(row);
                            }}
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ),
            },
        ],
        [canApprove, handleApprove, handleReject, navigate],
    );

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
                    onClick={() => {
                        setActiveTab('list');
                        window.dispatchEvent(new CustomEvent('sidebar:request-collapse', { detail: false }));
                    }}
                >
                    <List size={16} /> Danh sách
                </button>
                <button
                    role="tab"
                    aria-selected={activeTab === 'timesheet'}
                    className={`task-log__tab ${activeTab === 'timesheet' ? 'task-log__tab--active' : ''}`}
                    onClick={() => {
                        setActiveTab('timesheet');
                        window.dispatchEvent(new CustomEvent('sidebar:request-collapse', { detail: false }));
                    }}
                >
                    <CalendarDays size={16} /> Chấm công
                </button>
                <button
                    role="tab"
                    aria-selected={activeTab === 'gacp'}
                    className={`task-log__tab ${activeTab === 'gacp' ? 'task-log__tab--active' : ''}`}
                    onClick={() => {
                        setActiveTab('gacp');
                        window.dispatchEvent(new CustomEvent('sidebar:request-collapse', { detail: true }));
                    }}
                >
                    <BookOpenCheck size={16} /> GACP
                </button>
            </div>

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

            {activeTab === 'timesheet' && (
                <div className="card task-log__timesheet-card">
                    <TimesheetView onApproveException={handleApproveException} />
                </div>
            )}

            {activeTab === 'gacp' && (
                <React.Suspense fallback={<div style={{ padding: 24, textAlign: 'center' }}>Loading...</div>}>
                    <GACPDiaryView />
                </React.Suspense>
            )}

            {/* Detail Drawer */}
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
                                    <label>Ngày</label>
                                    <span>{selectedLog.date}</span>
                                </div>
                                <div className="task-log__detail-field">
                                    <label>Vùng trồng</label>
                                    <code className="task-log__cycle-code">{selectedLog.plotId}</code>
                                </div>
                                <div className="task-log__detail-field">
                                    <label>Trạng thái</label>
                                    <StatusBadge status={selectedLog.status} />
                                </div>
                                <div className="task-log__detail-field">
                                    <label>Nhân công</label>
                                    <span>{selectedLog.workerName}</span>
                                </div>
                                <div className="task-log__detail-field">
                                    <label>Vật tư</label>
                                    <span>{selectedLog.material || '—'}</span>
                                </div>
                            </div>
                        </div>
                        {canApprove && selectedLog.status === 'pending' && (
                            <div className="task-log__detail-actions">
                                <button
                                    className="btn btn--primary"
                                    onClick={() => handleApprove(selectedLog.id)}
                                    disabled={isLoading}
                                >
                                    <Check size={16} /> Duyệt
                                </button>
                                <button
                                    className="btn btn--danger"
                                    onClick={() => handleReject(selectedLog.id)}
                                    disabled={isLoading}
                                >
                                    <XCircle size={16} /> Từ chối
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </DetailDrawer>

            {/* Delete Confirm */}
            <Modal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                title="Xóa nhật ký"
                footer={
                    <div className="modal-actions">
                        <button className="btn btn--outline" onClick={() => setDeleteConfirm(null)}>
                            Hủy
                        </button>
                        <button className="btn btn--danger" onClick={handleDelete} disabled={isLoading}>
                            <Trash2 size={16} /> Xóa
                        </button>
                    </div>
                }
            >
                <p>
                    Xóa nhật ký <strong>{deleteConfirm?.task}</strong> ngày {deleteConfirm?.date}?
                </p>
            </Modal>
        </div>
    );
};

export default TaskLogList;
