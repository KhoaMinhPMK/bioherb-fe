import React from 'react';
import { Download, Filter } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import './ReportPage.scss';
const costByCategory = [
    { name: 'Phân bón', value: 22000 },
    { name: 'Nông dược', value: 14400 },
    { name: 'Nhân công', value: 18600 },
    { name: 'Thiết bị', value: 5200 },
    { name: 'Nguyên liệu', value: 3500 },
];
const costSummary = [
    { id: 1, cycle: '2025-DX', supply: '18.500.000 ₫', labor: '12.000.000 ₫', equipment: '3.200.000 ₫', total: '33.700.000 ₫', yield: '9.2 tấn', costPerTon: '3.663.000 ₫' },
    { id: 2, cycle: '2025-HT', supply: '15.200.000 ₫', labor: '11.500.000 ₫', equipment: '2.800.000 ₫', total: '29.500.000 ₫', yield: '8.5 tấn', costPerTon: '3.470.000 ₫' },
    { id: 3, cycle: '2026-DX', supply: '15.200.000 ₫', labor: '8.400.000 ₫', equipment: '1.800.000 ₫', total: '25.400.000 ₫', yield: '—', costPerTon: '—' },
];
const maxCost = Math.max(...costByCategory.map(c => c.value));
const summaryColumns = [
    { key: 'cycle', label: 'Mùa vụ', sortable: true },
    { key: 'supply', label: 'Vật tư' },
    { key: 'labor', label: 'Nhân công' },
    { key: 'equipment', label: 'Thiết bị' },
    { key: 'total', label: 'Tổng', render: (v) => <strong>{v}</strong> },
    { key: 'yield', label: 'Sản lượng' },
    { key: 'costPerTon', label: 'Chi phí/tấn' },
];
const ReportPage = () => (<div className="page-container">
        <PageHeader title="Báo cáo" subtitle="Phân tích chi phí, sản lượng và tiến độ sản xuất" actions={<>
                    <button className="btn btn--outline"><Download size={16}/> Xuất PDF</button>
                    <button className="btn btn--outline"><Download size={16}/> Xuất Excel</button>
                </>}/>

        <div className="report__filters">
            <select className="form-select report__filter-select" aria-label="Chọn farm">
                <option>Tất cả Farm</option>
                <option>Farm Long An</option>
                <option>Farm Đồng Tháp</option>
            </select>
            <select className="form-select report__filter-select" aria-label="Chọn năm">
                <option>2026</option>
                <option>2025</option>
            </select>
            <button className="btn btn--ghost"><Filter size={16}/> Lọc thêm</button>
        </div>

        <div className="report__charts">
            <div className="card">
                <div className="card__header"><h3 className="font-semibold">Chi phí theo loại (nghìn VNĐ)</h3></div>
                <div className="card__body">
                    <div className="report__bar-chart">
                        {costByCategory.map(c => (<div key={c.name} className="report__bar-row">
                                <span className="report__bar-label">{c.name}</span>
                                <div className="report__bar-track">
                                    <div className="report__bar-fill" style={{ width: `${(c.value / maxCost) * 100}%` }}/>
                                </div>
                                <span className="report__bar-value">{c.value.toLocaleString()}</span>
                            </div>))}
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card__header"><h3 className="font-semibold">Sản lượng kế hoạch vs thực tế (tấn)</h3></div>
                <div className="card__body">
                    <div className="report__yield-chart">
                        {[
        { name: '2025-DX', planned: 10, actual: 9.2 },
        { name: '2025-HT', planned: 10, actual: 8.5 },
        { name: '2026-DX', planned: 10, actual: 0 },
    ].map(d => (<div key={d.name} className="report__yield-group">
                                <div className="report__yield-bars">
                                    <div className="report__yield-bar report__yield-bar--planned" style={{ height: `${(d.planned / 10) * 100}%` }}>
                                        <span className="report__yield-bar-label">{d.planned}</span>
                                    </div>
                                    <div className="report__yield-bar report__yield-bar--actual" style={{ height: `${(d.actual / 10) * 100}%` }}>
                                        {d.actual > 0 && <span className="report__yield-bar-label">{d.actual}</span>}
                                    </div>
                                </div>
                                <span className="report__yield-name">{d.name}</span>
                            </div>))}
                    </div>
                    <div className="report__yield-legend">
                        <span className="report__legend-item report__legend-item--planned">Kế hoạch</span>
                        <span className="report__legend-item report__legend-item--actual">Thực tế</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="card">
            <div className="card__header"><h3 className="font-semibold">Tổng hợp chi phí</h3></div>
            <DataTable columns={summaryColumns} data={costSummary} pageSize={10}/>
        </div>
    </div>);
export default ReportPage;
