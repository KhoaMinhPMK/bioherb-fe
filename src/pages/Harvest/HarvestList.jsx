import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Wheat, Edit, Trash2, Save, X } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import './HarvestList.scss';

const EMPTY_HARVEST = { date: '', cycleId: '', plotId: '', quantity: '', quality: '—', lots: 0 };

const HarvestList = () => {
    const { harvestBatches, plots, cropCycles, addHarvestBatch, updateHarvestBatch, deleteHarvestBatch, isLoading } =
        useData();
    const { addToast } = useToast();
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState(EMPTY_HARVEST);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const tableData = useMemo(() => {
        return harvestBatches.map((h) => {
            const plot = plots.find((p) => p.id === h.plotId);
            return { ...h, plotName: plot?.name || h.plotId || '—' };
        });
    }, [harvestBatches, plots]);

    const openEdit = useCallback((item) => {
        setEditItem(item);
        setFormData({
            date: item.date,
            cycleId: item.cycleId || '',
            plotId: item.plotId || '',
            quantity: item.quantity,
            quality: item.quality,
            lots: item.lots,
        });
        setModalOpen(true);
    }, []);

    const harvestColumns = useMemo(
        () => [
            { key: 'id', label: 'Mã', sortable: true, render: (v) => <strong>{v}</strong> },
            { key: 'date', label: 'Ngày', sortable: true },
            { key: 'cycleId', label: 'Mùa vụ', render: (v) => <code className="cycle-code">{v}</code> },
            { key: 'plotName', label: 'Vùng trồng' },
            { key: 'quantity', label: 'Sản lượng', render: (v) => <span className="harvest-list__quantity">{v}</span> },
            { key: 'quality', label: 'Phân loại' },
            {
                key: 'lots',
                label: 'Lô',
                width: '100px',
                render: (v) =>
                    v > 0 ? (
                        <StatusBadge status="Active" label={`${v} lô`} />
                    ) : (
                        <StatusBadge status="Draft" label="Chưa tách" />
                    ),
            },
            {
                key: '_actions',
                label: '',
                width: '80px',
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
        if (!formData.date || !formData.quantity) {
            addToast('Vui lòng nhập đủ thông tin', 'error');
            return;
        }
        if (editItem) {
            await updateHarvestBatch(editItem.id, formData);
            addToast('Đã cập nhật đợt thu hoạch', 'success');
        } else {
            const newId = `H${String(harvestBatches.length + 1).padStart(2, '0')}`;
            await addHarvestBatch({ id: newId, ...formData });
            addToast('Đã tạo đợt thu hoạch mới', 'success');
        }
        setModalOpen(false);
        setEditItem(null);
        setFormData(EMPTY_HARVEST);
    }, [formData, editItem, harvestBatches.length, addHarvestBatch, updateHarvestBatch, addToast]);

    return (
        <div className="page-container">
            <PageHeader
                title="Thu hoạch & Lô sản phẩm"
                subtitle="Quản lý thu hoạch, đóng gói và sinh mã truy xuất"
                actions={
                    <button
                        className="btn btn--primary"
                        onClick={() => {
                            setEditItem(null);
                            setFormData(EMPTY_HARVEST);
                            setModalOpen(true);
                        }}
                    >
                        <Plus size={16} /> Tạo đợt thu hoạch
                    </button>
                }
            />

            <h3 className="section-heading">
                <Wheat size={18} /> Đợt thu hoạch
            </h3>
            <div className="card">
                <DataTable columns={harvestColumns} data={tableData} pageSize={10} />
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editItem ? 'Cập nhật thu hoạch' : 'Tạo đợt thu hoạch mới'}
                footer={
                    <div className="modal-actions">
                        <button className="btn btn--outline" onClick={() => setModalOpen(false)}>
                            <X size={16} /> Hủy
                        </button>
                        <button className="btn btn--primary" onClick={handleSave} disabled={isLoading}>
                            <Save size={16} /> {editItem ? 'Cập nhật' : 'Tạo'}
                        </button>
                    </div>
                }
            >
                <div className="form-fields">
                    <div className="form-field">
                        <label className="form-field__label">Ngày thu hoạch *</label>
                        <input
                            className="form-field__input"
                            value={formData.date}
                            onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
                            placeholder="DD/MM/YYYY"
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Vùng trồng</label>
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
                        <label className="form-field__label">Mùa vụ</label>
                        <select
                            className="form-field__input"
                            value={formData.cycleId}
                            onChange={(e) => setFormData((p) => ({ ...p, cycleId: e.target.value }))}
                        >
                            <option value="">-- Chọn --</option>
                            {cropCycles.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name} ({c.id})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Sản lượng *</label>
                        <input
                            className="form-field__input"
                            value={formData.quantity}
                            onChange={(e) => setFormData((p) => ({ ...p, quantity: e.target.value }))}
                            placeholder="VD: 8.5 tấn"
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Phân loại</label>
                        <select
                            className="form-field__input"
                            value={formData.quality}
                            onChange={(e) => setFormData((p) => ({ ...p, quality: e.target.value }))}
                        >
                            <option value="—">Chưa phân loại</option>
                            <option value="Loại A">Loại A</option>
                            <option value="Loại B">Loại B</option>
                            <option value="Loại C">Loại C</option>
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
                        <button
                            className="btn btn--danger"
                            onClick={async () => {
                                await deleteHarvestBatch(deleteConfirm.id);
                                addToast('Đã xóa', 'success');
                                setDeleteConfirm(null);
                            }}
                            disabled={isLoading}
                        >
                            <Trash2 size={16} /> Xóa
                        </button>
                    </div>
                }
            >
                <p>
                    Xóa đợt thu hoạch <strong>{deleteConfirm?.id}</strong>?
                </p>
            </Modal>
        </div>
    );
};

export default HarvestList;
