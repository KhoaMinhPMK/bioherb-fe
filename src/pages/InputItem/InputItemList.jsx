import React, { useState, useMemo } from 'react';
import { Plus, Package } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import FilterBar from '../../components/FilterBar';
import StatusBadge from '../../components/StatusBadge';
const items = [
    { id: 'VT001', name: 'Lân đỏ', type: 'Phân bón', unit: 'kg', price: '15.000', supplier: 'Cty DAP1', stock: 500 },
    { id: 'VT002', name: 'Sieubymsa 75WP', type: 'Nông dược', unit: 'gr', price: '12.000', supplier: 'Cty Bayer', stock: 2000 },
    { id: 'VT003', name: 'Hạt giống Lúa ST25', type: 'Nguyên liệu', unit: 'bao', price: '120.000', supplier: 'Trung tâm giống', stock: 10 },
    { id: 'VT004', name: 'Phân hữu cơ', type: 'Phân bón', unit: 'tấn', price: '1.800.000', supplier: 'Cty Hữu Cơ Xanh', stock: 20 },
    { id: 'VT005', name: 'Vôi nông nghiệp', type: 'Nguyên liệu', unit: 'kg', price: '3.000', supplier: 'Cty Vôi Miền Nam', stock: 800 },
    { id: 'VT006', name: 'Bao đựng lúa PP', type: 'Nguyên liệu', unit: 'bao', price: '5.000', supplier: 'Cty Bao Bì ABC', stock: 1500 },
];
const typeMap = { 'Nông dược': 'warning', 'Phân bón': 'info', 'Nguyên liệu': 'neutral' };
const columns = [
    { key: 'id', label: 'Mã', width: '80px', render: (v) => <strong>{v}</strong> },
    {
        key: 'name', label: 'Tên vật tư', sortable: true,
        render: (v) => <span className="font-medium"><Package size={14} aria-hidden="true" className="icon-inline"/> {v}</span>
    },
    { key: 'type', label: 'Loại', render: (v) => <StatusBadge status={v} variant={typeMap[v]} label={v}/> },
    { key: 'unit', label: 'ĐVT' },
    { key: 'price', label: 'Đơn giá', render: (v) => `${v} ₫` },
    { key: 'supplier', label: 'Nhà cung cấp' },
    {
        key: 'stock', label: 'Tồn kho', sortable: true,
        render: (v) => <span className={v < 100 ? 'text-error font-semibold' : 'font-semibold'}>{v}</span>
    },
];
const filterConfigs = [
    {
        key: 'type', label: 'Loại',
        options: [
            { value: 'Phân bón', label: 'Phân bón' },
            { value: 'Nông dược', label: 'Nông dược' },
            { value: 'Nguyên liệu', label: 'Nguyên liệu' },
        ]
    }
];
const InputItemList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({});
    const filteredItems = useMemo(() => {
        return items.filter(i => {
            if (searchTerm && !i.name.toLowerCase().includes(searchTerm.toLowerCase()))
                return false;
            if (filters.type && i.type !== filters.type)
                return false;
            return true;
        });
    }, [searchTerm, filters]);
    return (<div className="page-container">
            <PageHeader title="Danh mục vật tư" subtitle="Quản lý nông dược, phân bón, nguyên vật liệu" actions={<button className="btn btn--primary"><Plus size={16}/> Thêm vật tư</button>}/>
            <FilterBar searchPlaceholder="Tìm vật tư..." onSearch={setSearchTerm} filters={filterConfigs} onFilterChange={setFilters}/>
            <div className="card">
                <DataTable columns={columns} data={filteredItems} pageSize={10}/>
            </div>
        </div>);
};
export default InputItemList;
