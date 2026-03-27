import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Building2, Edit, Trash2, Save, X } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import FilterBar from '../../components/FilterBar';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import './FarmList.scss';

const EMPTY_FARM = { name: '', address: '', htxId: 'HTX01', status: 'active' };

const FarmList = () => {
    const navigate = useNavigate();
    const { farms, cooperatives, plots, cropCycles, users, addFarm, updateFarm, deleteFarm, isLoading } = useData();
    const { canSeeAllFarms, currentUser, isFarmManager } = useAuth();
    const { addToast } = useToast();

    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingFarm, setEditingFarm] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FARM);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Filter farms by role
    const visibleFarms = useMemo(() => {
        let list = farms;
        if (isFarmManager() && currentUser?.farmId) {
            list = farms.filter((f) => f.id === currentUser.farmId);
        } else if (!canSeeAllFarms() && currentUser?.farmId) {
            list = farms.filter((f) => f.id === currentUser.farmId);
        }
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            list = list.filter((f) => f.name.toLowerCase().includes(term) || f.address.toLowerCase().includes(term));
        }
        return list;
    }, [farms, searchTerm, isFarmManager, canSeeAllFarms, currentUser]);

    // Computed data for display
    const farmsWithMeta = useMemo(() => {
        return visibleFarms.map((farm) => {
            const plotCount = plots.filter((p) => p.farmId === farm.id).length;
            const activeCycleCount = cropCycles.filter((c) => {
                const plot = plots.find((p) => p.id === c.plotId);
                return plot?.farmId === farm.id && c.status === 'active';
            }).length;
            const manager = users.find((u) => u.id === farm.managerId);
            return { ...farm, plotCount, activeCycleCount, managerName: manager?.name || '—' };
        });
    }, [visibleFarms, plots, cropCycles, users]);

    const openCreateModal = useCallback(() => {
        setEditingFarm(null);
        setFormData(EMPTY_FARM);
        setModalOpen(true);
    }, []);

    const openEditModal = useCallback((farm) => {
        setEditingFarm(farm);
        setFormData({ name: farm.name, address: farm.address, htxId: farm.htxId, status: farm.status });
        setModalOpen(true);
    }, []);

    const handleSave = useCallback(async () => {
        if (!formData.name.trim()) {
            addToast('Vui lòng nhập tên Farm', 'error');
            return;
        }
        if (editingFarm) {
            await updateFarm(editingFarm.id, formData);
            addToast(`Đã cập nhật ${formData.name}`, 'success');
        } else {
            const newId = `F${String(farms.length + 1).padStart(2, '0')}`;
            await addFarm({ id: newId, ...formData, managerId: null });
            addToast(`Đã thêm ${formData.name}`, 'success');
        }
        setModalOpen(false);
    }, [formData, editingFarm, farms.length, addFarm, updateFarm, addToast]);

    const handleDelete = useCallback(
        async (farm) => {
            await deleteFarm(farm.id);
            addToast(`Đã xóa ${farm.name}`, 'success');
            setDeleteConfirm(null);
        },
        [deleteFarm, addToast],
    );

    const handleFieldChange = useCallback((field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }, []);

    return (
        <div className="page-container">
            <PageHeader
                title="Quản lý Farm"
                subtitle="Quản lý thông tin nông trại và cấu hình"
                actions={
                    canSeeAllFarms() ? (
                        <button className="btn btn--primary" onClick={openCreateModal}>
                            <Plus size={16} /> Thêm Farm
                        </button>
                    ) : null
                }
            />

            <FilterBar searchPlaceholder="Tìm kiếm farm..." onSearch={setSearchTerm} />

            {/* Farm Cards Grid */}
            <div className="farm-grid">
                {farmsWithMeta.map((farm) => (
                    <div key={farm.id} className="card farm-card" onClick={() => navigate(`/plots?farm=${farm.id}`)}>
                        <div className="card__body">
                            <div className="farm-card__header">
                                <div className="farm-card__icon">
                                    <Building2 size={22} aria-hidden="true" />
                                </div>
                                <StatusBadge status={farm.status} />
                            </div>
                            <div className="farm-card__info">
                                <span className="farm-card__code">{farm.id}</span>
                                <h3 className="farm-card__name">{farm.name}</h3>
                                <p className="farm-card__address">{farm.address}</p>
                            </div>
                            <div className="farm-card__meta">
                                <div className="farm-card__meta-item">
                                    <span className="farm-card__meta-value">{farm.plotCount}</span>
                                    <span className="farm-card__meta-label">Vùng trồng</span>
                                </div>
                                <div className="farm-card__meta-item">
                                    <span className="farm-card__meta-value">{farm.activeCycleCount}</span>
                                    <span className="farm-card__meta-label">Mùa vụ active</span>
                                </div>
                                <div className="farm-card__meta-item">
                                    <span className="farm-card__meta-value">{farm.managerName}</span>
                                    <span className="farm-card__meta-label">Quản lý</span>
                                </div>
                            </div>
                            {canSeeAllFarms() && (
                                <div className="farm-card__actions" onClick={(e) => e.stopPropagation()}>
                                    <button className="btn-icon" title="Sửa" onClick={() => openEditModal(farm)}>
                                        <Edit size={14} />
                                    </button>
                                    <button
                                        className="btn-icon btn-icon--danger"
                                        title="Xóa"
                                        onClick={() => setDeleteConfirm(farm)}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingFarm ? `Sửa Farm: ${editingFarm.name}` : 'Thêm Farm mới'}
                footer={
                    <div className="modal-actions">
                        <button className="btn btn--outline" onClick={() => setModalOpen(false)} disabled={isLoading}>
                            <X size={16} /> Hủy
                        </button>
                        <button className="btn btn--primary" onClick={handleSave} disabled={isLoading}>
                            <Save size={16} /> {editingFarm ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </div>
                }
            >
                <div className="form-fields">
                    <div className="form-field">
                        <label className="form-field__label">Tên Farm *</label>
                        <input
                            className="form-field__input"
                            value={formData.name}
                            onChange={(e) => handleFieldChange('name', e.target.value)}
                            placeholder="VD: Farm Long An"
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Địa chỉ</label>
                        <input
                            className="form-field__input"
                            value={formData.address}
                            onChange={(e) => handleFieldChange('address', e.target.value)}
                            placeholder="VD: ấp 2, xã Tân Hòa..."
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">HTX</label>
                        <select
                            className="form-field__input"
                            value={formData.htxId}
                            onChange={(e) => handleFieldChange('htxId', e.target.value)}
                        >
                            {cooperatives.map((htx) => (
                                <option key={htx.id} value={htx.id}>
                                    {htx.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Trạng thái</label>
                        <select
                            className="form-field__input"
                            value={formData.status}
                            onChange={(e) => handleFieldChange('status', e.target.value)}
                        >
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Ngưng hoạt động</option>
                        </select>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
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
                            onClick={() => handleDelete(deleteConfirm)}
                            disabled={isLoading}
                        >
                            <Trash2 size={16} /> Xóa
                        </button>
                    </div>
                }
            >
                <p>
                    Bạn có chắc chắn muốn xóa Farm <strong>{deleteConfirm?.name}</strong>?
                </p>
                <p className="text-muted">Thao tác này không thể hoàn tác.</p>
            </Modal>
        </div>
    );
};

export default FarmList;
