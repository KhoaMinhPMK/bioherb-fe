import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Building2, Eye, Edit, Trash2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import FilterBar from '../../components/FilterBar';
import StatusBadge from '../../components/StatusBadge';
import './FarmList.scss';
const farms = [
    { id: 'F01', name: 'Farm Long An', address: 'ấp 2, xã Tân Hòa, huyện Tân Thạnh, Long An', manager: 'Nguyễn Thị Bình', plots: 5, activeCycles: 3, status: 'active' },
    { id: 'F02', name: 'Farm Đồng Tháp', address: 'xã Mỹ An, huyện Tháp Mười, Đồng Tháp', manager: 'Trần Văn Tài', plots: 4, activeCycles: 2, status: 'active' },
    { id: 'F03', name: 'Farm Tiền Giang', address: 'xã Tân Phú, huyện Cai Lậy, Tiền Giang', manager: 'Lê Thị Cúc', plots: 3, activeCycles: 1, status: 'active' },
];
const columns = [
    { key: 'id', label: 'Mã', sortable: true, width: '80px', render: (val) => <strong>{val}</strong> },
    {
        key: 'name', label: 'Tên Farm', sortable: true,
        render: (val) => <span className="farm-list__name">{val}</span>
    },
    {
        key: 'address', label: 'Địa chỉ',
        render: (val) => <span className="farm-list__address">{val}</span>
    },
    { key: 'manager', label: 'Quản lý', sortable: true },
    { key: 'plots', label: 'Vùng trồng', sortable: true, width: '100px' },
    {
        key: 'status', label: 'Trạng thái',
        render: (val) => <StatusBadge status={val}/>
    },
    {
        key: '_actions', label: 'Thao tác', width: '120px',
        render: (_, row) => (<div className="farm-list__actions">
                <button className="btn-icon" title="Xem" aria-label={`Xem ${row.name}`}>
                    <Eye size={16}/>
                </button>
                <button className="btn-icon" title="Sửa" aria-label={`Sửa ${row.name}`}>
                    <Edit size={16}/>
                </button>
                <button className="btn-icon btn-icon--danger" title="Xóa" aria-label={`Xóa ${row.name}`}>
                    <Trash2 size={16}/>
                </button>
            </div>)
    },
];
const FarmList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const filteredFarms = useMemo(() => {
        if (!searchTerm)
            return farms;
        const term = searchTerm.toLowerCase();
        return farms.filter((f) => f.name.toLowerCase().includes(term) ||
            f.address.toLowerCase().includes(term) ||
            f.manager.toLowerCase().includes(term));
    }, [searchTerm]);
    return (<div className="page-container">
            <PageHeader title="Quản lý Farm" subtitle="Quản lý thông tin nông trại và cấu hình" actions={<>
                        <button className="btn btn--outline">
                            <Download size={16}/> Xuất Excel
                        </button>
                        <button className="btn btn--primary">
                            <Plus size={16}/> Thêm Farm
                        </button>
                    </>}/>

            <FilterBar searchPlaceholder="Tìm kiếm farm..." onSearch={setSearchTerm}/>

            {/* Farm Cards Grid */}
            <div className="farm-grid">
                {filteredFarms.map((farm) => (<div key={farm.id} className="card farm-card" onClick={() => navigate(`/plots?farm=${farm.id}`)}>
                        <div className="card__body">
                            <div className="farm-card__header">
                                <div className="farm-card__icon">
                                    <Building2 size={22} aria-hidden="true"/>
                                </div>
                                <StatusBadge status={farm.status}/>
                            </div>
                            <div className="farm-card__info">
                                <span className="farm-card__code">{farm.id}</span>
                                <h3 className="farm-card__name">{farm.name}</h3>
                                <p className="farm-card__address">{farm.address}</p>
                            </div>
                            <div className="farm-card__meta">
                                <div className="farm-card__meta-item">
                                    <span className="farm-card__meta-value">{farm.plots}</span>
                                    <span className="farm-card__meta-label">Vùng trồng</span>
                                </div>
                                <div className="farm-card__meta-item">
                                    <span className="farm-card__meta-value">{farm.activeCycles}</span>
                                    <span className="farm-card__meta-label">Mùa vụ active</span>
                                </div>
                                <div className="farm-card__meta-item">
                                    <span className="farm-card__meta-value">{farm.manager}</span>
                                    <span className="farm-card__meta-label">Quản lý</span>
                                </div>
                            </div>
                        </div>
                    </div>))}
            </div>

            {/* Table View */}
            <div className="card farm-list__table-card">
                <DataTable columns={columns} data={filteredFarms} pageSize={10}/>
            </div>
        </div>);
};
export default FarmList;
