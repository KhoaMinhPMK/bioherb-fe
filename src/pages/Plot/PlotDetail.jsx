import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, MapPin, Target, LayoutGrid, Info } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import { useToast } from '../../contexts/ToastContext';
import './PlotList.scss';
const cycleHistory = [
    { id: '2026-DX', crop: 'Lúa ST25', start: '01/01/2026', end: '25/05/2026', yield: '—', status: 'active' },
    { id: '2025-HT', crop: 'Lúa ST25', start: '01/06/2025', end: '25/10/2025', yield: '8.5 tấn', status: 'closed' },
    { id: '2025-DX', crop: 'Lúa ST25', start: '01/01/2025', end: '25/05/2025', yield: '9.2 tấn', status: 'closed' },
];
const cycleColumns = [
    { key: 'id', label: 'Mã mùa vụ', render: (v) => <strong>{v}</strong> },
    { key: 'crop', label: 'Cây trồng' },
    { key: 'start', label: 'Bắt đầu' },
    { key: 'end', label: 'Kết thúc' },
    { key: 'yield', label: 'Sản lượng' },
    { key: 'status', label: 'Trạng thái', render: (v) => <StatusBadge status={v}/> },
];
const PlotDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();
    return (<div className="page-container">
            <PageHeader title={`Chi tiết Vùng trồng — ${id}`} subtitle="Thông tin chi tiết và lịch sử mùa vụ" actions={<>
                        <button className="btn-icon" onClick={() => navigate('/plots')} aria-label="Quay lại">
                            <ArrowLeft size={20}/>
                        </button>
                        <button className="btn btn--outline" onClick={() => addToast('Chỉnh sửa Vùng trồng đang phát triển', 'info')}><Edit2 size={16}/> Chỉnh sửa</button>
                    </>}/>

            <div className="card">
                <div className="plot-header-card">
                    <div className="detail-field">
                        <label><Info size={14}/> Mã vùng</label>
                        <span className="font-semibold">{id}</span>
                    </div>
                    <div className="detail-field">
                        <label><LayoutGrid size={14}/> Tên vùng</label>
                        <span className="font-semibold">Ruộng lúa ST25</span>
                    </div>
                    <div className="detail-field">
                        <label><Target size={14}/> Farm</label>
                        <span className="font-semibold">Farm Long An</span>
                    </div>
                    <div className="detail-field">
                        <label><LayoutGrid size={14}/> Diện tích</label>
                        <span className="font-semibold">2 ha</span>
                    </div>
                    <div className="detail-field">
                        <label><MapPin size={14}/> Địa chỉ</label>
                        <span>ấp 2, xã Tân Hòa, huyện Tân Thạnh, Long An</span>
                    </div>
                    <div className="detail-field">
                        <label><Info size={14}/> Trạng thái</label>
                        <StatusBadge status="active"/>
                    </div>
                </div>
            </div>

            <h3 className="section-heading section-heading--spaced">Lịch sử mùa vụ</h3>
            <div className="card">
                <DataTable columns={cycleColumns} data={cycleHistory} pageSize={10}/>
            </div>
        </div>);
};
export default PlotDetail;
