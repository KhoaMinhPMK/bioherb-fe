import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Dropdown from '../../components/Dropdown';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import './TaskLog.scss';

const TASK_OPTIONS = [
    { value: 'Cày xới đất', label: 'Cày xới đất' },
    { value: 'Bón lót', label: 'Bón lót' },
    { value: 'Gieo sạ', label: 'Gieo sạ' },
    { value: 'Bón phân', label: 'Bón phân' },
    { value: 'Phun thuốc', label: 'Phun thuốc' },
    { value: 'Thu hoạch', label: 'Thu hoạch' },
    { value: 'Sơ chế', label: 'Sơ chế' },
    { value: 'Tưới tiêu', label: 'Tưới tiêu' },
];

const TaskLogForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { currentUser } = useAuth();
    const {
        taskLogs,
        cropCycles,
        plots,
        inputItems,
        workers: workersList,
        equipment: equipmentList,
        addTaskLog,
        updateTaskLog,
        isLoading,
    } = useData();

    const editLog = useMemo(() => (id ? taskLogs.find((l) => l.id === id) : null), [id, taskLogs]);

    const [formData, setFormData] = useState({
        cycleId: editLog?.cycleId || '',
        plotId: editLog?.plotId || '',
        date: editLog?.date || new Date().toISOString().split('T')[0],
        task: editLog?.task || '',
        startTime: editLog?.startTime || '07:00',
        endTime: editLog?.endTime || '11:30',
        breakHours: editLog?.breakHours || 0,
        notes: editLog?.notes || '',
        selectedWorkers: editLog?.selectedWorkers || [],
        equipmentId: editLog?.equipmentId || '',
        supplies: editLog?.supplies || [],
    });

    const cycleOptions = useMemo(
        () => cropCycles.map((c) => ({ value: c.id, label: `${c.id} — ${c.crop}` })),
        [cropCycles],
    );
    const plotOptions = useMemo(() => plots.map((p) => ({ value: p.id, label: p.name })), [plots]);
    const equipOptions = useMemo(
        () => [{ value: '', label: 'Không sử dụng' }, ...equipmentList.map((e) => ({ value: e.id, label: e.name }))],
        [equipmentList],
    );

    const handleField = useCallback((key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    }, []);

    const toggleWorker = useCallback((workerId) => {
        setFormData((prev) => {
            const list = prev.selectedWorkers.includes(workerId)
                ? prev.selectedWorkers.filter((w) => w !== workerId)
                : [...prev.selectedWorkers, workerId];
            return { ...prev, selectedWorkers: list };
        });
    }, []);

    const addSupplyRow = useCallback(() => {
        setFormData((prev) => ({
            ...prev,
            supplies: [...prev.supplies, { itemId: '', qty: 1 }],
        }));
    }, []);

    const removeSupplyRow = useCallback((idx) => {
        setFormData((prev) => ({
            ...prev,
            supplies: prev.supplies.filter((_, i) => i !== idx),
        }));
    }, []);

    const updateSupplyRow = useCallback((idx, key, value) => {
        setFormData((prev) => ({
            ...prev,
            supplies: prev.supplies.map((s, i) => (i === idx ? { ...s, [key]: value } : s)),
        }));
    }, []);

    const handleSave = useCallback(async () => {
        if (!formData.task || !formData.date) {
            addToast('Vui lòng nhập công việc và ngày', 'error');
            return;
        }
        const workerNames = formData.selectedWorkers
            .map((wId) => workersList.find((w) => w.id === wId)?.name || wId)
            .join(', ');

        const logEntry = {
            ...formData,
            workerName: workerNames || currentUser?.name,
            status: 'pending',
        };

        if (editLog) {
            await updateTaskLog(id, logEntry);
            addToast('Đã cập nhật nhật ký', 'success');
        } else {
            const newId = `TL${String(taskLogs.length + 1).padStart(3, '0')}`;
            await addTaskLog({ id: newId, ...logEntry, createdBy: currentUser?.id });
            addToast('Đã lưu nhật ký thành công', 'success');
        }
        navigate('/task-logs');
    }, [
        formData,
        editLog,
        id,
        taskLogs.length,
        workersList,
        currentUser,
        addTaskLog,
        updateTaskLog,
        addToast,
        navigate,
    ]);

    return (
        <div className="page-container">
            <PageHeader
                title={editLog ? 'Sửa nhật ký' : 'Ghi nhật ký sản xuất'}
                subtitle="Nhập chi tiết công việc thực tế"
                actions={
                    <>
                        <button className="btn-icon" onClick={() => navigate('/task-logs')} aria-label="Quay lại">
                            <ArrowLeft size={20} />
                        </button>
                        <button className="btn btn--primary" onClick={handleSave} disabled={isLoading}>
                            <Save size={16} /> {editLog ? 'Cập nhật' : 'Lưu nhật ký'}
                        </button>
                    </>
                }
            />

            <div className="card">
                <div className="card__body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label" htmlFor="cycle">
                                Mùa vụ *
                            </label>
                            <Dropdown
                                options={cycleOptions}
                                placeholder="Chọn mùa vụ..."
                                value={formData.cycleId}
                                onChange={(v) => handleField('cycleId', v)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="plot">
                                Vùng trồng
                            </label>
                            <Dropdown
                                options={plotOptions}
                                placeholder="Chọn vùng trồng..."
                                value={formData.plotId}
                                onChange={(v) => handleField('plotId', v)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="date">
                                Ngày làm việc *
                            </label>
                            <input
                                id="date"
                                type="date"
                                className="form-input"
                                value={formData.date}
                                onChange={(e) => handleField('date', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="task">
                                Công việc *
                            </label>
                            <Dropdown
                                options={TASK_OPTIONS}
                                placeholder="Chọn công việc..."
                                value={formData.task}
                                onChange={(v) => handleField('task', v)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="startTime">
                                Thời gian bắt đầu
                            </label>
                            <input
                                id="startTime"
                                type="time"
                                className="form-input"
                                value={formData.startTime}
                                onChange={(e) => handleField('startTime', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="endTime">
                                Thời gian kết thúc
                            </label>
                            <input
                                id="endTime"
                                type="time"
                                className="form-input"
                                value={formData.endTime}
                                onChange={(e) => handleField('endTime', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Supplies Section */}
            <div className="card task-log-form__section">
                <div className="card__header">
                    <h3 className="font-semibold">Vật tư sử dụng</h3>
                </div>
                <div className="card__body">
                    {formData.supplies.map((sup, idx) => (
                        <div key={sup.itemId || `supply-${idx}`} className="task-log-form__supply-row">
                            <select
                                className="form-input"
                                value={sup.itemId}
                                onChange={(e) => updateSupplyRow(idx, 'itemId', e.target.value)}
                            >
                                <option value="">Chọn vật tư...</option>
                                {inputItems.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name} ({item.unit})
                                    </option>
                                ))}
                            </select>
                            <input
                                className="form-input"
                                type="number"
                                value={sup.qty}
                                onChange={(e) => updateSupplyRow(idx, 'qty', parseInt(e.target.value, 10) || 0)}
                                placeholder="SL"
                                min="0"
                            />
                            <button className="btn-icon btn-icon--danger" onClick={() => removeSupplyRow(idx)}>
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                    <button className="btn btn--outline task-log-form__add-btn" onClick={addSupplyRow}>
                        <Plus size={14} /> Thêm vật tư
                    </button>
                </div>
            </div>

            {/* Workers Section */}
            <div className="card task-log-form__section">
                <div className="card__header">
                    <h3 className="font-semibold">Nhân công</h3>
                </div>
                <div className="card__body">
                    <div className="task-log-form__workers">
                        {workersList.map((w) => (
                            <label key={w.id} className="task-log-form__worker-chip">
                                <input
                                    type="checkbox"
                                    className="task-log-form__worker-checkbox"
                                    checked={formData.selectedWorkers.includes(w.id)}
                                    onChange={() => toggleWorker(w.id)}
                                />
                                {w.name}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Equipment & Notes */}
            <div className="card task-log-form__section">
                <div className="card__header">
                    <h3 className="font-semibold">Thiết bị & Ghi chú</h3>
                </div>
                <div className="card__body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label" htmlFor="equipment">
                                Thiết bị
                            </label>
                            <Dropdown
                                options={equipOptions}
                                placeholder="Chọn thiết bị..."
                                value={formData.equipmentId}
                                onChange={(v) => handleField('equipmentId', v)}
                            />
                        </div>
                        <div className="form-group task-log-form__notes">
                            <label className="form-label" htmlFor="notes">
                                Ghi chú
                            </label>
                            <textarea
                                id="notes"
                                className="form-textarea"
                                rows={3}
                                placeholder="Ghi chú thêm..."
                                value={formData.notes}
                                onChange={(e) => handleField('notes', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskLogForm;
