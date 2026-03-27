import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Edit, Trash2, Save, X, Building2, MapPin } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import FilterBar from '../../components/FilterBar';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import DetailDrawer from '../../components/DetailDrawer';
import Modal from '../../components/Modal';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import './Cooperative.scss';

const EMPTY_HTX = { name: '', address: '', director: '', phone: '', email: '', status: 'active', memberCount: 0 };

const CooperativeList = () => {
    const { cooperatives, farms, addCooperative, updateCooperative, deleteCooperative, isLoading } = useData();
    const { addToast } = useToast();
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState(EMPTY_HTX);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [selectedHtx, setSelectedHtx] = useState(null);

    const filtered = useMemo(() => {
        if (!search) return cooperatives;
        const s = search.toLowerCase();
        return cooperatives.filter((c) => c.name?.toLowerCase().includes(s) || c.director?.toLowerCase().includes(s));
    }, [cooperatives, search]);

    const openEdit = useCallback((item) => {
        setEditItem(item);
        setFormData({
            name: item.name,
            address: item.address || '',
            director: item.director || '',
            phone: item.phone || '',
            email: item.email || '',
            status: item.status || 'active',
            memberCount: item.memberCount || 0,
        });
        setModalOpen(true);
    }, []);

    const columns = useMemo(
        () => [
            { key: 'id', label: 'Mã', width: '80px', render: (v) => <code>{v}</code> },
            { key: 'name', label: 'Tên HTX', sortable: true, render: (v) => <strong>{v}</strong> },
            { key: 'director', label: 'Giám đốc', hideOnMobile: true },
            { key: 'memberCount', label: 'Thành viên', width: '100px' },
            {
                key: 'status',
                label: 'TT',
                render: (v) => (
                    <StatusBadge
                        status={v === 'active' ? 'Active' : 'Closed'}
                        label={v === 'active' ? 'HĐ' : 'Ngừng'}
                    />
                ),
            },
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

    const htxFarms = useMemo(() => {
        if (!selectedHtx) return [];
        return farms.filter((f) => f.htxId === selectedHtx.id);
    }, [selectedHtx, farms]);

    const handleSave = useCallback(async () => {
        if (!formData.name.trim()) {
            addToast('Nhập tên HTX', 'error');
            return;
        }
        if (editItem) {
            await updateCooperative(editItem.id, formData);
            addToast('Đã cập nhật HTX', 'success');
        } else {
            const newId = `HTX${String(cooperatives.length + 1).padStart(2, '0')}`;
            await addCooperative({ id: newId, ...formData });
            addToast('Đã thêm HTX', 'success');
        }
        setModalOpen(false);
        setEditItem(null);
        setFormData(EMPTY_HTX);
    }, [formData, editItem, cooperatives.length, addCooperative, updateCooperative, addToast]);

    const handleDelete = useCallback(async () => {
        await deleteCooperative(deleteConfirm.id);
        addToast('Đã xóa HTX', 'success');
        setDeleteConfirm(null);
    }, [deleteConfirm, deleteCooperative, addToast]);

    return (
        <div className="page-container">
            <PageHeader
                title="Hợp tác xã"
                subtitle={`${cooperatives.length} HTX`}
                actions={
                    <button
                        className="btn btn--primary"
                        onClick={() => {
                            setEditItem(null);
                            setFormData(EMPTY_HTX);
                            setModalOpen(true);
                        }}
                    >
                        <Plus size={16} /> Thêm HTX
                    </button>
                }
            />
            <FilterBar searchPlaceholder="Tìm HTX..." onSearch={setSearch} />
            <div className="card">
                <DataTable columns={columns} data={filtered} pageSize={10} onRowClick={(row) => setSelectedHtx(row)} />
            </div>

            <DetailDrawer
                isOpen={!!selectedHtx}
                onClose={() => setSelectedHtx(null)}
                title={selectedHtx ? selectedHtx.name : ''}
            >
                {selectedHtx && (
                    <div className="cooperative__detail">
                        <div className="detail-grid">
                            <div className="detail-field">
                                <label>Giám đốc</label>
                                <span>{selectedHtx.director || '—'}</span>
                            </div>
                            <div className="detail-field">
                                <label>Địa chỉ</label>
                                <span>{selectedHtx.address || '—'}</span>
                            </div>
                            <div className="detail-field">
                                <label>SĐT</label>
                                <span>{selectedHtx.phone || '—'}</span>
                            </div>
                            <div className="detail-field">
                                <label>Email</label>
                                <span>{selectedHtx.email || '—'}</span>
                            </div>
                            <div className="detail-field">
                                <label>Thành viên</label>
                                <span>{selectedHtx.memberCount}</span>
                            </div>
                        </div>
                        <h4 className="cooperative__sub-title">
                            <Building2 size={16} /> Farm thuộc HTX ({htxFarms.length})
                        </h4>
                        {htxFarms.length > 0 ? (
                            <ul className="cooperative__farm-list">
                                {htxFarms.map((f) => (
                                    <li key={f.id} className="cooperative__farm-item">
                                        <MapPin size={14} /> <strong>{f.name}</strong> — {f.address || ''}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="cooperative__empty">Chưa có farm nào</p>
                        )}
                    </div>
                )}
            </DetailDrawer>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editItem ? 'Sửa HTX' : 'Thêm HTX'}
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
                        <label className="form-field__label">Tên HTX *</label>
                        <input
                            className="form-field__input"
                            value={formData.name}
                            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Giám đốc</label>
                        <input
                            className="form-field__input"
                            value={formData.director}
                            onChange={(e) => setFormData((p) => ({ ...p, director: e.target.value }))}
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Địa chỉ</label>
                        <input
                            className="form-field__input"
                            value={formData.address}
                            onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">SĐT</label>
                        <input
                            className="form-field__input"
                            value={formData.phone}
                            onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Email</label>
                        <input
                            className="form-field__input"
                            value={formData.email}
                            onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Số thành viên</label>
                        <input
                            className="form-field__input"
                            type="number"
                            value={formData.memberCount}
                            onChange={(e) =>
                                setFormData((p) => ({ ...p, memberCount: parseInt(e.target.value, 10) || 0 }))
                            }
                        />
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                title="Xóa HTX"
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
                    Xóa HTX <strong>{deleteConfirm?.name}</strong>?
                </p>
            </Modal>
        </div>
    );
};

export default CooperativeList;
