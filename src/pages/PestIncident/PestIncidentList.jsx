import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Bug, Edit, Trash2, Save, X } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import FilterBar from '../../components/FilterBar';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';

const severityMap = { Nặng: 'error', 'Trung bình': 'warning', Nhẹ: 'info' };
const EMPTY_INCIDENT = {
    date: '',
    plotId: '',
    cycleId: '',
    type: '',
    severity: 'Nhẹ',
    area: '',
    treatment: '',
    status: 'monitoring',
};

const PestIncidentList = () => {
    const { pestIncidents, plots, addPestIncident, updatePestIncident, deletePestIncident, isLoading } = useData();
    const { addToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState(EMPTY_INCIDENT);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const tableData = useMemo(() => {
        let list = pestIncidents.map((p) => {
            const plot = plots.find((pl) => pl.id === p.plotId);
            return { ...p, plotName: plot?.name || p.plotId };
        });
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            list = list.filter(
                (i) =>
                    i.type?.toLowerCase().includes(term) ||
                    i.plotName?.toLowerCase().includes(term) ||
                    i.treatment?.toLowerCase().includes(term),
            );
        }
        return list;
    }, [pestIncidents, plots, searchTerm]);

    const openEdit = useCallback((item) => {
        setEditItem(item);
        setFormData({
            date: item.date,
            plotId: item.plotId,
            cycleId: item.cycleId || '',
            type: item.type,
            severity: item.severity,
            area: item.area,
            treatment: item.treatment,
            status: item.status,
        });
        setModalOpen(true);
    }, []);

    const columns = useMemo(
        () => [
            { key: 'date', label: 'Ngày', sortable: true, width: '100px' },
            { key: 'plotName', label: 'Vùng trồng', sortable: true },
            {
                key: 'type',
                label: 'Loại',
                render: (v) => (
                    <span>
                        <Bug size={14} aria-hidden="true" className="icon-inline" /> {v}
                    </span>
                ),
            },
            {
                key: 'severity',
                label: 'Mức độ',
                render: (v) => <StatusBadge status={v} variant={severityMap[v]} label={v} />,
            },
            { key: 'area', label: 'Diện tích', hideOnMobile: true },
            { key: 'treatment', label: 'Biện pháp', hideOnMobile: true },
            { key: 'status', label: 'Trạng thái', render: (v) => <StatusBadge status={v} /> },
            {
                key: '_actions',
                label: 'Thao tác',
                width: '100px',
                render: (_, row) => (
                    <div className="table-actions">
                        <button className="btn-icon" title="Sửa" onClick={() => openEdit(row)}>
                            <Edit size={14} />
                        </button>
                        <button className="btn-icon btn-icon--danger" title="Xóa" onClick={() => setDeleteConfirm(row)}>
                            <Trash2 size={14} />
                        </button>
                    </div>
                ),
            },
        ],
        [openEdit],
    );

    const handleSave = useCallback(async () => {
        if (!formData.type.trim() || !formData.plotId) {
            addToast('Vui lòng nhập loại và vùng trồng', 'error');
            return;
        }
        if (editItem) {
            await updatePestIncident(editItem.id, formData);
            addToast('Đã cập nhật sự cố', 'success');
        } else {
            const newId = pestIncidents.length + 1;
            await addPestIncident({ id: newId, ...formData });
            addToast('Đã ghi nhận sự cố mới', 'success');
        }
        setModalOpen(false);
        setEditItem(null);
        setFormData(EMPTY_INCIDENT);
    }, [formData, editItem, pestIncidents.length, addPestIncident, updatePestIncident, addToast]);

    const handleDelete = useCallback(async () => {
        await deletePestIncident(deleteConfirm.id);
        addToast('Đã xóa sự cố', 'success');
        setDeleteConfirm(null);
    }, [deleteConfirm, deletePestIncident, addToast]);

    return (
        <div className="page-container">
            <PageHeader
                title="Sâu bệnh / Sự cố"
                subtitle="Theo dõi và xử lý sâu bệnh, sự cố trên đồng"
                actions={
                    <button
                        className="btn btn--primary"
                        onClick={() => {
                            setEditItem(null);
                            setFormData(EMPTY_INCIDENT);
                            setModalOpen(true);
                        }}
                    >
                        <Plus size={16} /> Ghi nhận sự cố
                    </button>
                }
            />
            <FilterBar searchPlaceholder="Tìm sự cố..." onSearch={setSearchTerm} />
            <div className="card">
                <DataTable columns={columns} data={tableData} pageSize={10} />
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editItem ? 'Cập nhật sự cố' : 'Ghi nhận sự cố mới'}
                footer={
                    <div className="modal-actions">
                        <button className="btn btn--outline" onClick={() => setModalOpen(false)}>
                            <X size={16} /> Hủy
                        </button>
                        <button className="btn btn--primary" onClick={handleSave} disabled={isLoading}>
                            <Save size={16} /> {editItem ? 'Cập nhật' : 'Thêm'}
                        </button>
                    </div>
                }
            >
                <div className="form-fields">
                    <div className="form-field">
                        <label className="form-field__label">Ngày phát hiện *</label>
                        <input
                            className="form-field__input"
                            value={formData.date}
                            onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
                            placeholder="DD/MM/YYYY"
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Vùng trồng *</label>
                        <select
                            className="form-field__input"
                            value={formData.plotId}
                            onChange={(e) => setFormData((p) => ({ ...p, plotId: e.target.value }))}
                        >
                            <option value="">-- Chọn --</option>
                            {plots.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Loại sâu bệnh *</label>
                        <input
                            className="form-field__input"
                            value={formData.type}
                            onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
                            placeholder="VD: Đạo ôn, Bọ phấn..."
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Mức độ</label>
                        <select
                            className="form-field__input"
                            value={formData.severity}
                            onChange={(e) => setFormData((p) => ({ ...p, severity: e.target.value }))}
                        >
                            <option value="Nhẹ">Nhẹ</option>
                            <option value="Trung bình">Trung bình</option>
                            <option value="Nặng">Nặng</option>
                        </select>
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Diện tích ảnh hưởng</label>
                        <input
                            className="form-field__input"
                            value={formData.area}
                            onChange={(e) => setFormData((p) => ({ ...p, area: e.target.value }))}
                            placeholder="VD: 0.3 ha"
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Biện pháp xử lý</label>
                        <input
                            className="form-field__input"
                            value={formData.treatment}
                            onChange={(e) => setFormData((p) => ({ ...p, treatment: e.target.value }))}
                            placeholder="VD: Phun thuốc..."
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Trạng thái</label>
                        <select
                            className="form-field__input"
                            value={formData.status}
                            onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
                        >
                            <option value="monitoring">Đang theo dõi</option>
                            <option value="resolved">Đã xử lý</option>
                        </select>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirm */}
            <Modal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                title="Xác nhận xóa"
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
                    Xóa sự cố <strong>{deleteConfirm?.type}</strong> tại {deleteConfirm?.plotName}?
                </p>
            </Modal>
        </div>
    );
};

export default PestIncidentList;
