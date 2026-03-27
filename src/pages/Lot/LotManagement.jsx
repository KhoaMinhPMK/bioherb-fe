import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Printer, Edit, Trash2, Save, X } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import FilterBar from '../../components/FilterBar';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import './LotManagement.scss';

const LotManagement = () => {
    const { harvestBatches, cropCycles, plots, addHarvestBatch, updateHarvestBatch, deleteHarvestBatch, isLoading } =
        useData();
    const { addToast } = useToast();
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState({
        lotCode: '',
        plotId: '',
        cycleId: '',
        quantityKg: 0,
        harvestDate: '',
        status: 'pending',
    });
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const data = useMemo(() => {
        let list = harvestBatches.map((h) => {
            const plot = plots.find((p) => p.id === h.plotId);
            const cycle = cropCycles.find((c) => c.id === h.cycleId);
            return { ...h, plotName: plot?.name || h.plotId, cycleName: cycle?.crop || h.cycleId };
        });
        if (search) {
            const s = search.toLowerCase();
            list = list.filter((l) => l.lotCode?.toLowerCase().includes(s) || l.plotName?.toLowerCase().includes(s));
        }
        return list;
    }, [harvestBatches, plots, cropCycles, search]);

    const openEdit = useCallback((item) => {
        setEditItem(item);
        setFormData({
            lotCode: item.lotCode,
            plotId: item.plotId,
            cycleId: item.cycleId,
            quantityKg: item.quantityKg,
            harvestDate: item.harvestDate || '',
            status: item.status || 'pending',
        });
        setModalOpen(true);
    }, []);

    const columns = useMemo(
        () => [
            { key: 'lotCode', label: 'Mã lô', sortable: true, render: (v) => <code className="lot__code">{v}</code> },
            { key: 'cycleName', label: 'Cây trồng' },
            { key: 'plotName', label: 'Vùng trồng', hideOnMobile: true },
            { key: 'quantityKg', label: 'SL (kg)', render: (v) => <strong>{(v || 0).toLocaleString('vi-VN')}</strong> },
            { key: 'harvestDate', label: 'Ngày thu', width: '100px' },
            {
                key: 'status',
                label: 'TT',
                render: (v) => (
                    <StatusBadge
                        status={v === 'packed' ? 'Active' : v === 'pending' ? 'Harvesting' : 'Closed'}
                        label={v === 'packed' ? 'Đóng gói' : v === 'pending' ? 'Chờ' : v}
                    />
                ),
            },
            {
                key: '_actions',
                label: '',
                width: '110px',
                render: (_, row) => (
                    <div className="table-actions">
                        <button
                            className="btn-icon"
                            title="In nhãn QR"
                            onClick={(e) => {
                                e.stopPropagation();
                                addToast(`Đang in nhãn QR cho lô ${row.lotCode}`, 'success');
                            }}
                        >
                            <Printer size={14} />
                        </button>
                        <button
                            className="btn-icon"
                            title="Sửa"
                            onClick={(e) => {
                                e.stopPropagation();
                                openEdit(row);
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
        [addToast, openEdit],
    );

    const handleSave = useCallback(async () => {
        if (!formData.lotCode.trim()) {
            addToast('Nhập mã lô', 'error');
            return;
        }
        if (editItem) {
            await updateHarvestBatch(editItem.id, formData);
            addToast('Đã cập nhật lô hàng', 'success');
        } else {
            const newId = `H${String(harvestBatches.length + 1).padStart(2, '0')}`;
            await addHarvestBatch({ id: newId, ...formData });
            addToast('Đã tạo lô hàng', 'success');
        }
        setModalOpen(false);
        setEditItem(null);
    }, [formData, editItem, harvestBatches.length, addHarvestBatch, updateHarvestBatch, addToast]);

    const handleDelete = useCallback(async () => {
        await deleteHarvestBatch(deleteConfirm.id);
        addToast('Đã xóa lô hàng', 'success');
        setDeleteConfirm(null);
    }, [deleteConfirm, deleteHarvestBatch, addToast]);

    return (
        <div className="page-container">
            <PageHeader
                title="Quản lý lô hàng"
                subtitle={`${harvestBatches.length} lô`}
                actions={
                    <button
                        className="btn btn--primary"
                        onClick={() => {
                            setEditItem(null);
                            setFormData({
                                lotCode: '',
                                plotId: '',
                                cycleId: '',
                                quantityKg: 0,
                                harvestDate: '',
                                status: 'pending',
                            });
                            setModalOpen(true);
                        }}
                    >
                        <Plus size={16} /> Tạo lô
                    </button>
                }
            />
            <FilterBar searchPlaceholder="Tìm lô hàng..." onSearch={setSearch} />
            <div className="card">
                <DataTable columns={columns} data={data} pageSize={10} />
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editItem ? 'Sửa lô' : 'Tạo lô mới'}
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
                        <label className="form-field__label">Mã lô *</label>
                        <input
                            className="form-field__input"
                            value={formData.lotCode}
                            onChange={(e) => setFormData((p) => ({ ...p, lotCode: e.target.value }))}
                            placeholder="VD: F01-VT01-2026DX-H01"
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
                                    {c.id} — {c.crop}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Sản lượng (kg)</label>
                        <input
                            className="form-field__input"
                            type="number"
                            value={formData.quantityKg}
                            onChange={(e) =>
                                setFormData((p) => ({ ...p, quantityKg: parseInt(e.target.value, 10) || 0 }))
                            }
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Ngày thu hoạch</label>
                        <input
                            className="form-field__input"
                            type="date"
                            value={formData.harvestDate}
                            onChange={(e) => setFormData((p) => ({ ...p, harvestDate: e.target.value }))}
                        />
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                title="Xóa lô hàng"
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
                    Xóa lô <strong>{deleteConfirm?.lotCode}</strong>?
                </p>
            </Modal>
        </div>
    );
};

export default LotManagement;
