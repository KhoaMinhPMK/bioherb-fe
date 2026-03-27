import React, { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Save, X } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import ProgressBar from '../../components/ProgressBar';
import Modal from '../../components/Modal';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import './CropCycle.scss';

const logColumns = [
    { key: 'date', label: 'Ngày', width: '100px' },
    { key: 'task', label: 'Công việc' },
    { key: 'workerName', label: 'Nhân công', hideOnMobile: true },
    { key: 'status', label: 'Trạng thái', render: (v) => <StatusBadge status={v} /> },
];

const CropCycleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { cropCycles, plots, taskLogs, updateCropCycle, isLoading } = useData();
    const [editOpen, setEditOpen] = useState(false);

    const cycle = useMemo(() => cropCycles.find((c) => c.id === id), [id, cropCycles]);
    const plot = useMemo(() => (cycle ? plots.find((p) => p.id === cycle.plotId) : null), [cycle, plots]);
    const logs = useMemo(() => taskLogs.filter((l) => l.cycleId === id), [id, taskLogs]);

    const [formData, setFormData] = useState({});

    const openEdit = useCallback(() => {
        if (!cycle) return;
        setFormData({
            crop: cycle.crop,
            start: cycle.start,
            end: cycle.end,
            status: cycle.status,
            progress: cycle.progress,
        });
        setEditOpen(true);
    }, [cycle]);

    const handleSave = useCallback(async () => {
        await updateCropCycle(id, formData);
        addToast('Đã cập nhật mùa vụ', 'success');
        setEditOpen(false);
    }, [id, formData, updateCropCycle, addToast]);

    if (!cycle) {
        return (
            <div className="page-container">
                <PageHeader title="Không tìm thấy mùa vụ" />
                <button className="btn btn--outline" onClick={() => navigate('/crop-cycles')}>
                    <ArrowLeft size={16} /> Quay lại
                </button>
            </div>
        );
    }

    const stats = [
        { label: 'Tiến độ', value: `${cycle.progress}%` },
        { label: 'Tổng chi phí', value: `${(cycle.cost || 0).toLocaleString('vi-VN')} ₫` },
        { label: 'Nhật ký', value: `${logs.length} bản ghi` },
        { label: 'Vùng trồng', value: plot?.name || '—' },
    ];

    return (
        <div className="page-container">
            <PageHeader
                title={`Mùa vụ ${id}`}
                subtitle={`${cycle.crop} — ${plot?.name || ''}`}
                actions={
                    <>
                        <button className="btn-icon" onClick={() => navigate('/crop-cycles')} aria-label="Quay lại">
                            <ArrowLeft size={20} />
                        </button>
                        <button className="btn btn--outline" onClick={openEdit}>
                            <Edit2 size={16} /> Chỉnh sửa
                        </button>
                    </>
                }
            />

            <div className="cycle-detail__stats">
                {stats.map((s) => (
                    <div key={s.label} className="card">
                        <div className="card__body cycle-detail__stat-card">
                            <span className="cycle-detail__stat-label">{s.label}</span>
                            <p className="cycle-detail__stat-value">{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card">
                <div className="card__header">
                    <h3 className="font-semibold">Tiến độ</h3>
                </div>
                <div className="card__body">
                    <ProgressBar value={cycle.progress} size="lg" />
                    <div className="cycle-detail__info-row">
                        <span>
                            Bắt đầu: <strong>{cycle.start}</strong>
                        </span>
                        <span>
                            Kết thúc: <strong>{cycle.end}</strong>
                        </span>
                        <StatusBadge status={cycle.status} />
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card__header">
                    <h3 className="font-semibold">Nhật ký sản xuất ({logs.length})</h3>
                </div>
                <DataTable columns={logColumns} data={logs} pageSize={10} />
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={editOpen}
                onClose={() => setEditOpen(false)}
                title="Chỉnh sửa mùa vụ"
                footer={
                    <div className="modal-actions">
                        <button className="btn btn--outline" onClick={() => setEditOpen(false)}>
                            <X size={16} /> Hủy
                        </button>
                        <button className="btn btn--primary" onClick={handleSave} disabled={isLoading}>
                            <Save size={16} /> Lưu
                        </button>
                    </div>
                }
            >
                <div className="form-fields">
                    <div className="form-field">
                        <label className="form-field__label">Cây trồng</label>
                        <input
                            className="form-field__input"
                            value={formData.crop || ''}
                            onChange={(e) => setFormData((p) => ({ ...p, crop: e.target.value }))}
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Ngày bắt đầu</label>
                        <input
                            className="form-field__input"
                            value={formData.start || ''}
                            onChange={(e) => setFormData((p) => ({ ...p, start: e.target.value }))}
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Ngày kết thúc</label>
                        <input
                            className="form-field__input"
                            value={formData.end || ''}
                            onChange={(e) => setFormData((p) => ({ ...p, end: e.target.value }))}
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Trạng thái</label>
                        <select
                            className="form-field__input"
                            value={formData.status || 'Active'}
                            onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
                        >
                            <option value="Active">Active</option>
                            <option value="Harvesting">Harvesting</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Tiến độ (%)</label>
                        <input
                            className="form-field__input"
                            type="number"
                            value={formData.progress || 0}
                            onChange={(e) =>
                                setFormData((p) => ({ ...p, progress: parseInt(e.target.value, 10) || 0 }))
                            }
                            min="0"
                            max="100"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CropCycleDetail;
