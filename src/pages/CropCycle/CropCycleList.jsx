import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Sprout, Edit, Trash2, Save, X } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import FilterBar from '../../components/FilterBar';
import StatusBadge from '../../components/StatusBadge';
import ProgressBar from '../../components/ProgressBar';
import DetailDrawer from '../../components/DetailDrawer';
import Modal from '../../components/Modal';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';

const EMPTY_CYCLE = { plotId: '', crop: '', start: '', end: '', status: 'Active', progress: 0, cost: 0 };

const filterConfigs = [
    {
        key: 'status',
        label: 'Trạng thái',
        options: [
            { value: 'Active', label: 'Active' },
            { value: 'Harvesting', label: 'Harvesting' },
            { value: 'Closed', label: 'Closed' },
        ],
    },
];

const CropCycleList = () => {
    const { cropCycles, plots, addCropCycle, updateCropCycle, deleteCropCycle, isLoading } = useData();
    const { addToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({});
    const [selectedCycle, setSelectedCycle] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState(EMPTY_CYCLE);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const tableData = useMemo(() => {
        let list = cropCycles.map((c) => {
            const plot = plots.find((p) => p.id === c.plotId);
            return {
                ...c,
                plotName: plot?.name || c.plotId,
                costDisplay: (c.cost || 0).toLocaleString('vi-VN'),
            };
        });
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            list = list.filter(
                (c) =>
                    c.id?.toLowerCase().includes(term) ||
                    c.plotName?.toLowerCase().includes(term) ||
                    c.crop?.toLowerCase().includes(term),
            );
        }
        if (filters.status) {
            list = list.filter((c) => c.status === filters.status);
        }
        return list;
    }, [cropCycles, plots, searchTerm, filters]);

    const openEdit = useCallback((item) => {
        setEditItem(item);
        setFormData({
            plotId: item.plotId,
            crop: item.crop,
            start: item.start,
            end: item.end,
            status: item.status,
            progress: item.progress,
            cost: item.cost || 0,
        });
        setModalOpen(true);
    }, []);

    const columns = useMemo(
        () => [
            { key: 'id', label: 'Mã', sortable: true, width: '100px', render: (v) => <strong>{v}</strong> },
            { key: 'plotName', label: 'Vùng trồng', sortable: true },
            {
                key: 'crop',
                label: 'Cây trồng',
                sortable: true,
                render: (v) => (
                    <span className="crop-cycle__crop-cell">
                        <Sprout size={14} aria-hidden="true" /> {v}
                    </span>
                ),
            },
            { key: 'start', label: 'Bắt đầu', sortable: true, width: '100px', hideOnMobile: true },
            { key: 'end', label: 'Kết thúc', sortable: true, width: '100px', hideOnMobile: true },
            {
                key: 'progress',
                label: 'Tiến độ',
                sortable: true,
                width: '140px',
                render: (v) => <ProgressBar value={v} size="sm" />,
            },
            {
                key: 'cost',
                label: 'Chi phí',
                sortable: true,
                hideOnMobile: true,
                render: (_, row) => <span className="crop-cycle__cost">{row.costDisplay} ₫</span>,
            },
            { key: 'status', label: 'TT', sortable: true, render: (v) => <StatusBadge status={v} /> },
            {
                key: '_actions',
                label: '',
                width: '80px',
                render: (_, row) => (
                    <div className="table-actions">
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
        [openEdit],
    );

    const handleSave = useCallback(async () => {
        if (!formData.crop.trim() || !formData.plotId) {
            addToast('Vui lòng nhập đủ thông tin', 'error');
            return;
        }
        if (editItem) {
            await updateCropCycle(editItem.id, formData);
            addToast('Đã cập nhật mùa vụ', 'success');
        } else {
            const year = new Date().getFullYear();
            const newId = `${year}-MV${cropCycles.length + 1}`;
            await addCropCycle({ id: newId, ...formData });
            addToast('Đã tạo mùa vụ mới', 'success');
        }
        setModalOpen(false);
        setEditItem(null);
        setFormData(EMPTY_CYCLE);
    }, [formData, editItem, cropCycles.length, addCropCycle, updateCropCycle, addToast]);

    const handleDelete = useCallback(async () => {
        await deleteCropCycle(deleteConfirm.id);
        addToast('Đã xóa mùa vụ', 'success');
        setDeleteConfirm(null);
    }, [deleteConfirm, deleteCropCycle, addToast]);

    return (
        <div className="page-container">
            <PageHeader
                title="Mùa vụ"
                subtitle="Quản lý mùa vụ theo vùng trồng"
                actions={
                    <button
                        className="btn btn--primary"
                        onClick={() => {
                            setEditItem(null);
                            setFormData(EMPTY_CYCLE);
                            setModalOpen(true);
                        }}
                    >
                        <Plus size={16} /> Tạo mùa vụ
                    </button>
                }
            />
            <FilterBar
                searchPlaceholder="Tìm mùa vụ..."
                onSearch={setSearchTerm}
                filters={filterConfigs}
                onFilterChange={setFilters}
            />
            <div className="card">
                <DataTable
                    columns={columns}
                    data={tableData}
                    pageSize={10}
                    onRowClick={(row) => setSelectedCycle(row)}
                />
            </div>

            {/* Detail Drawer */}
            <DetailDrawer
                isOpen={!!selectedCycle}
                onClose={() => setSelectedCycle(null)}
                title={selectedCycle ? `Mùa vụ ${selectedCycle.id}` : ''}
            >
                {selectedCycle && (
                    <div className="crop-cycle__detail">
                        <div className="crop-cycle__detail-grid">
                            <div className="detail-field">
                                <label>Mã mùa vụ</label>
                                <strong>{selectedCycle.id}</strong>
                            </div>
                            <div className="detail-field">
                                <label>Trạng thái</label>
                                <StatusBadge status={selectedCycle.status} />
                            </div>
                            <div className="detail-field">
                                <label>Vùng trồng</label>
                                <span>{selectedCycle.plotName}</span>
                            </div>
                            <div className="detail-field">
                                <label>Cây trồng</label>
                                <span>{selectedCycle.crop}</span>
                            </div>
                            <div className="detail-field">
                                <label>Bắt đầu</label>
                                <span>{selectedCycle.start}</span>
                            </div>
                            <div className="detail-field">
                                <label>Kết thúc</label>
                                <span>{selectedCycle.end}</span>
                            </div>
                            <div className="detail-field">
                                <label>Tiến độ</label>
                                <ProgressBar value={selectedCycle.progress} size="md" />
                            </div>
                            <div className="detail-field">
                                <label>Chi phí</label>
                                <span className="crop-cycle__cost">{selectedCycle.costDisplay} ₫</span>
                            </div>
                        </div>
                    </div>
                )}
            </DetailDrawer>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editItem ? 'Cập nhật mùa vụ' : 'Tạo mùa vụ mới'}
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
                        <label className="form-field__label">Cây trồng *</label>
                        <input
                            className="form-field__input"
                            value={formData.crop}
                            onChange={(e) => setFormData((p) => ({ ...p, crop: e.target.value }))}
                            placeholder="VD: Cúc Hoa Vàng"
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Ngày bắt đầu</label>
                        <input
                            className="form-field__input"
                            value={formData.start}
                            onChange={(e) => setFormData((p) => ({ ...p, start: e.target.value }))}
                            placeholder="DD/MM/YYYY"
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Ngày kết thúc</label>
                        <input
                            className="form-field__input"
                            value={formData.end}
                            onChange={(e) => setFormData((p) => ({ ...p, end: e.target.value }))}
                            placeholder="DD/MM/YYYY"
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Trạng thái</label>
                        <select
                            className="form-field__input"
                            value={formData.status}
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
                            value={formData.progress}
                            onChange={(e) =>
                                setFormData((p) => ({ ...p, progress: parseInt(e.target.value, 10) || 0 }))
                            }
                            min="0"
                            max="100"
                        />
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
                    Xóa mùa vụ <strong>{deleteConfirm?.id}</strong> ({deleteConfirm?.crop})?
                </p>
            </Modal>
        </div>
    );
};

export default CropCycleList;
