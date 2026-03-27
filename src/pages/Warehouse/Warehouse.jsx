import React, { useState, useMemo, useCallback } from 'react';
import { Package, ArrowDownCircle, ArrowUpCircle, X } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import FilterBar from '../../components/FilterBar';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import './Warehouse.scss';

const mockTransactions = [
    {
        id: 'TX001',
        date: '23/03/2026',
        type: 'in',
        item: 'Phân hữu cơ',
        qty: 500,
        unit: 'kg',
        note: 'Nhập từ NCC Hóa Nông',
    },
    {
        id: 'TX002',
        date: '22/03/2026',
        type: 'out',
        item: 'Lân đỏ Long Thành',
        qty: 50,
        unit: 'kg',
        note: 'Cấp cho VT02 — Bón lót',
    },
    { id: 'TX003', date: '21/03/2026', type: 'in', item: 'Sieubymsa 75WP', qty: 20, unit: 'gói', note: 'Nhập bổ sung' },
    {
        id: 'TX004',
        date: '20/03/2026',
        type: 'out',
        item: 'Hạt giống ST25',
        qty: 100,
        unit: 'kg',
        note: 'Cấp cho VT01 — Gieo sạ',
    },
    {
        id: 'TX005',
        date: '19/03/2026',
        type: 'out',
        item: 'Phân hữu cơ',
        qty: 200,
        unit: 'kg',
        note: 'Cấp cho VT03 — Bón phân',
    },
    {
        id: 'TX006',
        date: '18/03/2026',
        type: 'in',
        item: 'Thuốc trừ sâu Bio',
        qty: 30,
        unit: 'chai',
        note: 'Nhập đợt 3',
    },
];

const Warehouse = () => {
    const { inputItems } = useData();
    const { addToast } = useToast();
    const [search, setSearch] = useState('');
    const [txModalOpen, setTxModalOpen] = useState(false);
    const [txType, setTxType] = useState('in');

    const inventory = useMemo(() => {
        return inputItems.map((item) => ({
            ...item,
            stockDisplay: `${(item.stock || 0).toLocaleString('vi-VN')} ${item.unit}`,
            stockStatus: (item.stock || 0) <= (item.minStock || 10) ? 'low' : 'ok',
        }));
    }, [inputItems]);

    const filteredInventory = useMemo(() => {
        if (!search) return inventory;
        const s = search.toLowerCase();
        return inventory.filter((i) => i.name?.toLowerCase().includes(s));
    }, [inventory, search]);

    const filteredTx = useMemo(() => {
        if (!search) return mockTransactions;
        const s = search.toLowerCase();
        return mockTransactions.filter((t) => t.item.toLowerCase().includes(s) || t.note.toLowerCase().includes(s));
    }, [search]);

    const inventoryColumns = [
        { key: 'name', label: 'Tên vật tư', sortable: true, render: (v) => <strong>{v}</strong> },
        { key: 'category', label: 'Loại', hideOnMobile: true },
        { key: 'stockDisplay', label: 'Tồn kho', sortable: true },
        {
            key: 'stockStatus',
            label: 'Mức',
            width: '80px',
            render: (v) => (
                <StatusBadge status={v === 'low' ? 'Closed' : 'Active'} label={v === 'low' ? 'Thấp' : 'Đủ'} />
            ),
        },
    ];

    const txColumns = [
        { key: 'date', label: 'Ngày', width: '100px' },
        {
            key: 'type',
            label: 'Loại',
            width: '80px',
            render: (v) => (
                <span className={`warehouse__tx-type warehouse__tx-type--${v}`}>
                    {v === 'in' ? (
                        <>
                            <ArrowDownCircle size={14} /> Nhập
                        </>
                    ) : (
                        <>
                            <ArrowUpCircle size={14} /> Xuất
                        </>
                    )}
                </span>
            ),
        },
        { key: 'item', label: 'Vật tư' },
        { key: 'qty', label: 'SL', render: (v, row) => `${v} ${row.unit}` },
        { key: 'note', label: 'Ghi chú', hideOnMobile: true },
    ];

    const handleCreateTx = useCallback(() => {
        addToast(`Đã tạo phiếu ${txType === 'in' ? 'nhập' : 'xuất'} kho`, 'success');
        setTxModalOpen(false);
    }, [txType, addToast]);

    return (
        <div className="page-container">
            <PageHeader
                title="Quản lý kho vật tư"
                subtitle="Nhập/xuất kho và theo dõi tồn kho"
                actions={
                    <>
                        <button
                            className="btn btn--primary"
                            onClick={() => {
                                setTxType('in');
                                setTxModalOpen(true);
                            }}
                        >
                            <ArrowDownCircle size={16} /> Nhập kho
                        </button>
                        <button
                            className="btn btn--outline"
                            onClick={() => {
                                setTxType('out');
                                setTxModalOpen(true);
                            }}
                        >
                            <ArrowUpCircle size={16} /> Xuất kho
                        </button>
                    </>
                }
            />
            <FilterBar searchPlaceholder="Tìm vật tư..." onSearch={setSearch} />

            <div className="card">
                <div className="card__header">
                    <h3 className="font-semibold">
                        <Package size={16} /> Tồn kho hiện tại
                    </h3>
                </div>
                <DataTable columns={inventoryColumns} data={filteredInventory} pageSize={10} />
            </div>

            <div className="card">
                <div className="card__header">
                    <h3 className="font-semibold">Lịch sử giao dịch</h3>
                </div>
                <DataTable columns={txColumns} data={filteredTx} pageSize={10} />
            </div>

            <Modal
                isOpen={txModalOpen}
                onClose={() => setTxModalOpen(false)}
                title={txType === 'in' ? 'Nhập kho' : 'Xuất kho'}
                footer={
                    <div className="modal-actions">
                        <button className="btn btn--outline" onClick={() => setTxModalOpen(false)}>
                            <X size={16} /> Hủy
                        </button>
                        <button className="btn btn--primary" onClick={handleCreateTx}>
                            Lưu phiếu
                        </button>
                    </div>
                }
            >
                <div className="form-fields">
                    <div className="form-field">
                        <label className="form-field__label">Vật tư</label>
                        <select className="form-field__input">
                            <option value="">-- Chọn --</option>
                            {inputItems.map((i) => (
                                <option key={i.id} value={i.id}>
                                    {i.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Số lượng</label>
                        <input className="form-field__input" type="number" placeholder="0" />
                    </div>
                    <div className="form-field">
                        <label className="form-field__label">Ghi chú</label>
                        <textarea className="form-field__input" rows={2} placeholder="Lý do nhập/xuất..." />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Warehouse;
