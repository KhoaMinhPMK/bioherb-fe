import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import './CropCycle.scss';
const stats = [
    { label: 'Tiến độ', value: '65%' },
    { label: 'Tổng chi phí', value: '15.200.000 ₫' },
    { label: 'Nhật ký', value: '23 bản ghi' },
    { label: 'Sản lượng (dự kiến)', value: '10 tấn' },
];
const recentLogs = [
    { id: 1, date: '21/03/2026', task: 'Bón phân', workers: 'Nguyễn An, Trần Văn Tài', supply: '440kg Lân đỏ', cost: '6.600.000 ₫' },
    { id: 2, date: '19/03/2026', task: 'Phun thuốc', workers: 'Lê Thị Cúc, Nguyễn Văn Phương', supply: '600gr Sieubymsa 75WP', cost: '7.200.000 ₫' },
    { id: 3, date: '01/03/2026', task: 'Gieo sạ', workers: 'Nguyễn An, Lê Thị Cúc', supply: '1 bao hạt giống', cost: '120.000 ₫' },
];
const logColumns = [
    { key: 'date', label: 'Ngày', width: '100px' },
    { key: 'task', label: 'Công việc' },
    { key: 'workers', label: 'Nhân công' },
    { key: 'supply', label: 'Vật tư' },
    { key: 'cost', label: 'Chi phí' },
];
const CropCycleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    return (<div className="page-container">
            <PageHeader title={`Mùa vụ ${id}`} subtitle="KPI, kế hoạch, nhật ký, sâu bệnh, thu hoạch" actions={<>
                        <button className="btn-icon" onClick={() => navigate('/crop-cycles')} aria-label="Quay lại">
                            <ArrowLeft size={20}/>
                        </button>
                        <button className="btn btn--outline"><Edit2 size={16}/> Chỉnh sửa</button>
                    </>}/>

            <div className="cycle-detail__stats">
                {stats.map((s, i) => (<div key={i} className="card">
                        <div className="card__body cycle-detail__stat-card">
                            <span className="cycle-detail__stat-label">{s.label}</span>
                            <p className="cycle-detail__stat-value">{s.value}</p>
                        </div>
                    </div>))}
            </div>

            <div className="card">
                <div className="card__header">
                    <h3 className="font-semibold">Nhật ký sản xuất gần đây</h3>
                </div>
                <DataTable columns={logColumns} data={recentLogs} pageSize={10}/>
            </div>
        </div>);
};
export default CropCycleDetail;
