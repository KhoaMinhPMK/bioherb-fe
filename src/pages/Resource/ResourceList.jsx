import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Users, Wrench, Edit, Trash2, Save, X } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';

const EMPTY_WORKER = { name: '', role: 'Nhân viên', salary: '300.000', phone: '', status: 'active' };
const EMPTY_EQUIPMENT = { name: '', type: 'Máy nông nghiệp', fuelCost: '100.000', status: 'active' };

const ResourceList = () => {
    const {
        workers,
        equipment,
        addWorker,
        updateWorker,
        deleteWorker,
        addEquipment,
        updateEquipment,
        deleteEquipment,
        isLoading,
    } = useData();
    const { addToast } = useToast();

    const [modalType, setModalType] = useState(null); // 'worker' | 'equipment'
    const [editItem, setEditItem] = useState(null);
    const [workerForm, setWorkerForm] = useState(EMPTY_WORKER);
    const [equipForm, setEquipForm] = useState(EMPTY_EQUIPMENT);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // --- Workers ---
    const workerColumns = useMemo(
        () => [
            { key: 'id', label: 'Mã', width: '80px', render: (v) => <strong>{v}</strong> },
            { key: 'name', label: 'Họ tên', sortable: true },
            { key: 'role', label: 'Chức vụ', sortable: true },
            { key: 'salary', label: 'Lương/ngày', render: (v) => `${v} ₫` },
            { key: 'phone', label: 'SĐT', hideOnMobile: true },
            { key: 'status', label: 'Trạng thái', render: (v) => <StatusBadge status={v} /> },
            {
                key: '_actions',
                label: '',
                width: '80px',
                render: (_, row) => (
                    <div className="table-actions">
                        <button
                            className="btn-icon"
                            title="Sửa"
                            onClick={() => {
                                setEditItem(row);
                                setWorkerForm({
                                    name: row.name,
                                    role: row.role,
                                    salary: row.salary,
                                    phone: row.phone,
                                    status: row.status,
                                });
                                setModalType('worker');
                            }}
                        >
                            <Edit size={14} />
                        </button>
                        <button
                            className="btn-icon btn-icon--danger"
                            title="Xóa"
                            onClick={() => setDeleteConfirm({ ...row, entityType: 'worker' })}
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ),
            },
        ],
        [],
    );

    // --- Equipment ---
    const equipmentColumns = useMemo(
        () => [
            { key: 'id', label: 'Mã', width: '80px', render: (v) => <strong>{v}</strong> },
            { key: 'name', label: 'Tên thiết bị', sortable: true },
            { key: 'type', label: 'Loại', sortable: true },
            { key: 'fuelCost', label: 'Chi phí NL/giờ', render: (v) => `${v} ₫` },
            { key: 'status', label: 'Trạng thái', render: (v) => <StatusBadge status={v} /> },
            {
                key: '_actions',
                label: '',
                width: '80px',
                render: (_, row) => (
                    <div className="table-actions">
                        <button
                            className="btn-icon"
                            title="Sửa"
                            onClick={() => {
                                setEditItem(row);
                                setEquipForm({
                                    name: row.name,
                                    type: row.type,
                                    fuelCost: row.fuelCost,
                                    status: row.status,
                                });
                                setModalType('equipment');
                            }}
                        >
                            <Edit size={14} />
                        </button>
                        <button
                            className="btn-icon btn-icon--danger"
                            title="Xóa"
                            onClick={() => setDeleteConfirm({ ...row, entityType: 'equipment' })}
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ),
            },
        ],
        [],
    );

    const handleSaveWorker = useCallback(async () => {
        if (!workerForm.name.trim()) {
            addToast('Nhập họ tên', 'error');
            return;
        }
        if (editItem) {
            await updateWorker(editItem.id, workerForm);
            addToast('Đã cập nhật nhân công', 'success');
        } else {
            const newId = `NC${String(workers.length + 1).padStart(2, '0')}`;
            await addWorker({ id: newId, ...workerForm });
            addToast('Đã thêm nhân công', 'success');
        }
        setModalType(null);
        setEditItem(null);
        setWorkerForm(EMPTY_WORKER);
    }, [workerForm, editItem, workers.length, addWorker, updateWorker, addToast]);

    const handleSaveEquipment = useCallback(async () => {
        if (!equipForm.name.trim()) {
            addToast('Nhập tên thiết bị', 'error');
            return;
        }
        if (editItem) {
            await updateEquipment(editItem.id, equipForm);
            addToast('Đã cập nhật thiết bị', 'success');
        } else {
            const newId = `TB${String(equipment.length + 1).padStart(2, '0')}`;
            await addEquipment({ id: newId, ...equipForm });
            addToast('Đã thêm thiết bị', 'success');
        }
        setModalType(null);
        setEditItem(null);
        setEquipForm(EMPTY_EQUIPMENT);
    }, [equipForm, editItem, equipment.length, addEquipment, updateEquipment, addToast]);

    const handleDelete = useCallback(async () => {
        if (deleteConfirm.entityType === 'worker') {
            await deleteWorker(deleteConfirm.id);
        } else {
            await deleteEquipment(deleteConfirm.id);
        }
        addToast('Đã xóa', 'success');
        setDeleteConfirm(null);
    }, [deleteConfirm, deleteWorker, deleteEquipment, addToast]);

    return (
        <div className="page-container">
            <PageHeader
                title="Nhân công & Thiết bị"
                subtitle="Quản lý nguồn lực sản xuất"
                actions={
                    <>
                        <button
                            className="btn btn--outline"
                            onClick={() => {
                                setEditItem(null);
                                setEquipForm(EMPTY_EQUIPMENT);
                                setModalType('equipment');
                            }}
                        >
                            <Wrench size={16} /> Thêm thiết bị
                        </button>
                        <button
                            className="btn btn--primary"
                            onClick={() => {
                                setEditItem(null);
                                setWorkerForm(EMPTY_WORKER);
                                setModalType('worker');
                            }}
                        >
                            <Plus size={16} /> Thêm nhân công
                        </button>
                    </>
                }
            />

            <h3 className="section-heading">
                <Users size={18} aria-hidden="true" /> Nhân công
            </h3>
            <div className="card">
                <DataTable columns={workerColumns} data={workers} pageSize={10} />
            </div>

            <h3 className="section-heading section-heading--spaced">
                <Wrench size={18} aria-hidden="true" /> Thiết bị
            </h3>
            <div className="card">
                <DataTable columns={equipmentColumns} data={equipment} pageSize={10} />
            </div>

            {/* Worker Modal */}
            <Modal
                isOpen={modalType === 'worker'}
                onClose={() => setModalType(null)}
                title={editItem ? 'Sửa nhân công' : 'Thêm nhân công'}
                footer={
                    <div className="modal-actions">
                        <button className="btn btn--outline" onClick={() => setModalType(null)}>
                            <X size={16} /> Hủy
                        </button>
                        <button className="btn btn--primary" onClick={handleSaveWorker} disabled={isLoading}>
                            <Save size={16} /> {editItem ? 'Cập nhật' : 'Thêm'}
                        </button>
                    </div>
                }
            >
                <div className="form-fields">
                    <div className="form-field">
                        <label className="form-field__label">Họ tên *</label>
                        <input
                            className="form-field__input"
                            value={workerForm.name}
                            onChange={(e) => setWorkerForm((p) => ({ ...p, name: e.target.value }))}
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Chức vụ</label>
                        <select
                            className="form-field__input"
                            value={workerForm.role}
                            onChange={(e) => setWorkerForm((p) => ({ ...p, role: e.target.value }))}
                        >
                            <option value="Nhân viên">Nhân viên</option>
                            <option value="Kỹ thuật">Kỹ thuật</option>
                            <option value="Quản lý">Quản lý</option>
                        </select>
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Lương/ngày</label>
                        <input
                            className="form-field__input"
                            value={workerForm.salary}
                            onChange={(e) => setWorkerForm((p) => ({ ...p, salary: e.target.value }))}
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">SĐT</label>
                        <input
                            className="form-field__input"
                            value={workerForm.phone}
                            onChange={(e) => setWorkerForm((p) => ({ ...p, phone: e.target.value }))}
                        />
                    </div>
                </div>
            </Modal>

            {/* Equipment Modal */}
            <Modal
                isOpen={modalType === 'equipment'}
                onClose={() => setModalType(null)}
                title={editItem ? 'Sửa thiết bị' : 'Thêm thiết bị'}
                footer={
                    <div className="modal-actions">
                        <button className="btn btn--outline" onClick={() => setModalType(null)}>
                            <X size={16} /> Hủy
                        </button>
                        <button className="btn btn--primary" onClick={handleSaveEquipment} disabled={isLoading}>
                            <Save size={16} /> {editItem ? 'Cập nhật' : 'Thêm'}
                        </button>
                    </div>
                }
            >
                <div className="form-fields">
                    <div className="form-field">
                        <label className="form-field__label">Tên thiết bị *</label>
                        <input
                            className="form-field__input"
                            value={equipForm.name}
                            onChange={(e) => setEquipForm((p) => ({ ...p, name: e.target.value }))}
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Loại</label>
                        <select
                            className="form-field__input"
                            value={equipForm.type}
                            onChange={(e) => setEquipForm((p) => ({ ...p, type: e.target.value }))}
                        >
                            <option value="Máy nông nghiệp">Máy nông nghiệp</option>
                            <option value="Thiết bị tưới">Thiết bị tưới</option>
                            <option value="Phương tiện">Phương tiện</option>
                        </select>
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Chi phí nhiên liệu/giờ</label>
                        <input
                            className="form-field__input"
                            value={equipForm.fuelCost}
                            onChange={(e) => setEquipForm((p) => ({ ...p, fuelCost: e.target.value }))}
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
                    Xóa <strong>{deleteConfirm?.name}</strong>?
                </p>
            </Modal>
        </div>
    );
};

export default ResourceList;
