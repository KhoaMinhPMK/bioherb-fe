import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import FilterBar from '../../components/FilterBar';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';

const typeMap = { 'Nông dược': 'warning', 'Phân bón': 'info', 'Nguyên liệu': 'neutral' };
const EMPTY_ITEM = { name: '', type: 'Phân bón', unit: 'kg', price: '', supplier: '', stock: 0 };

const filterConfigs = [
    {
        key: 'type',
        label: 'Loại',
        options: [
            { value: 'Phân bón', label: 'Phân bón' },
            { value: 'Nông dược', label: 'Nông dược' },
            { value: 'Nguyên liệu', label: 'Nguyên liệu' },
        ],
    },
];

const InputItemList = () => {
    const { inputItems, addInputItem, updateInputItem, deleteInputItem, isLoading } = useData();
    const { addToast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState(EMPTY_ITEM);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const filteredItems = useMemo(() => {
        return inputItems.filter((i) => {
            if (searchTerm && !i.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
            if (filters.type && i.type !== filters.type) return false;
            return true;
        });
    }, [inputItems, searchTerm, filters]);

    const openEdit = useCallback((item) => {
        setEditItem(item);
        setFormData({
            name: item.name,
            type: item.type,
            unit: item.unit,
            price: item.price,
            supplier: item.supplier,
            stock: item.stock,
        });
        setModalOpen(true);
    }, []);

    const columns = useMemo(
        () => [
            { key: 'id', label: 'Mã', width: '80px', render: (v) => <strong>{v}</strong> },
            { key: 'name', label: 'Tên vật tư', sortable: true },
            { key: 'type', label: 'Loại', render: (v) => <StatusBadge status={v} variant={typeMap[v]} label={v} /> },
            { key: 'unit', label: 'ĐVT' },
            { key: 'price', label: 'Đơn giá', render: (v) => `${v} ₫` },
            { key: 'supplier', label: 'NCC', hideOnMobile: true },
            {
                key: 'stock',
                label: 'Tồn kho',
                sortable: true,
                render: (v) => <span className={v < 100 ? 'text-error font-semibold' : 'font-semibold'}>{v}</span>,
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
        if (!formData.name.trim()) {
            addToast('Nhập tên vật tư', 'error');
            return;
        }
        if (editItem) {
            await updateInputItem(editItem.id, formData);
            addToast('Đã cập nhật vật tư', 'success');
        } else {
            const newId = `VT${String(inputItems.length + 1).padStart(3, '0')}`;
            await addInputItem({ id: newId, ...formData });
            addToast('Đã thêm vật tư', 'success');
        }
        setModalOpen(false);
        setEditItem(null);
        setFormData(EMPTY_ITEM);
    }, [formData, editItem, inputItems.length, addInputItem, updateInputItem, addToast]);

    return (
        <div className="page-container">
            <PageHeader
                title="Danh mục vật tư"
                subtitle="Quản lý nông dược, phân bón, nguyên vật liệu"
                actions={
                    <button
                        className="btn btn--primary"
                        onClick={() => {
                            setEditItem(null);
                            setFormData(EMPTY_ITEM);
                            setModalOpen(true);
                        }}
                    >
                        <Plus size={16} /> Thêm vật tư
                    </button>
                }
            />
            <FilterBar
                searchPlaceholder="Tìm vật tư..."
                onSearch={setSearchTerm}
                filters={filterConfigs}
                onFilterChange={setFilters}
            />
            <div className="card">
                <DataTable columns={columns} data={filteredItems} pageSize={10} />
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editItem ? 'Sửa vật tư' : 'Thêm vật tư mới'}
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
                        <label className="form-field__label">Tên vật tư *</label>
                        <input
                            className="form-field__input"
                            value={formData.name}
                            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Loại</label>
                        <select
                            className="form-field__input"
                            value={formData.type}
                            onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
                        >
                            <option value="Phân bón">Phân bón</option>
                            <option value="Nông dược">Nông dược</option>
                            <option value="Nguyên liệu">Nguyên liệu</option>
                        </select>
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">ĐVT</label>
                        <input
                            className="form-field__input"
                            value={formData.unit}
                            onChange={(e) => setFormData((p) => ({ ...p, unit: e.target.value }))}
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Đơn giá</label>
                        <input
                            className="form-field__input"
                            value={formData.price}
                            onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                            placeholder="VD: 15.000"
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Nhà cung cấp</label>
                        <input
                            className="form-field__input"
                            value={formData.supplier}
                            onChange={(e) => setFormData((p) => ({ ...p, supplier: e.target.value }))}
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Tồn kho</label>
                        <input
                            className="form-field__input"
                            type="number"
                            value={formData.stock}
                            onChange={(e) => setFormData((p) => ({ ...p, stock: parseInt(e.target.value, 10) || 0 }))}
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
                        <button
                            className="btn btn--danger"
                            onClick={async () => {
                                await deleteInputItem(deleteConfirm.id);
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
                    Xóa vật tư <strong>{deleteConfirm?.name}</strong>?
                </p>
            </Modal>
        </div>
    );
};

export default InputItemList;
